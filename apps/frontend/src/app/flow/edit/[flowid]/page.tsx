"use client";

import useAuthRedirect, { BACKEND_URL } from "@/app/config";
import Modal from "@/components/Modal";
import { FlowCell } from "@/components/FlowCell";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DarkButton } from "@/components/buttons/DarkButton";

//the type of data returned by the backend, got from postman
interface Action {
  id: string;
  flowId: string;
  actionId: string;
  sortOrder: number;
  metadata: JSON;
  AvailableAction: {
    id: string;
    name: string;
    image: string;
  };
}

function useAvailableActionsAndTriggers() {
  const [availableActions, setAvailableActions] = useState([]);
  const [availableTriggers, setAvailableTriggers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }
    const headers = { Authorization: token };

    Promise.all([
      axios.get(`${BACKEND_URL}/api/v1/action/available`, { headers }),
      axios.get(`${BACKEND_URL}/api/v1/trigger/available`, { headers }),
    ])
      .then(([actionsRes, triggersRes]) => {
        setAvailableActions(actionsRes.data.availableActions || []);
        setAvailableTriggers(triggersRes.data.availableTriggers || []);
      })
      .catch((err) => {
        console.error("Error fetching available items:", err);
        setError("Failed to load available triggers/actions.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { availableActions, availableTriggers, loading, error };
}

// --- Main Page Component ---
export default function EditFlowPage() {
  useAuthRedirect();
  const router = useRouter();
  const params = useParams(); // Get URL parameters
  const flowid = params?.flowid as string; // Extract flowid

  // State for available items
  const {
    availableActions,
    availableTriggers,
    loading: loadingAvailable,
    error: availableError,
  } = useAvailableActionsAndTriggers();

  const [selectedTrigger, setSelectedTrigger] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>();

  //which actions are chosen by the user
  const [selectedActions, setSelectedActions] = useState<
    {
      idx: number;
      availableActionId: string;
      availableActionName: string;
      availableActionImage: string;
      metadata: unknown;
    }[]
  >([]);

  const [loadingFlow, setLoadingFlow] = useState(true); // Loading state for the specific flow
  const [flowError, setFlowError] = useState(""); // Error state for fetching the flow

  // State for UI control
  const [modalForStep, setModalForStep] = useState<null | number>(null); // Step index (1 for trigger, 2+ for actions)
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // --- Fetch Existing Flow Data ---
  useEffect(() => {
    if (!flowid) {
      setFlowError("Flow ID not found in URL.");
      setLoadingFlow(false);
      return; // Don't fetch if no ID
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setFlowError("Not authenticated");
      setLoadingFlow(false);
      return;
    }

    setLoadingFlow(true);
    axios
      .get(`${BACKEND_URL}/api/v1/flow/${flowid}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        const flowData = res.data.flow;
        if (
          !flowData ||
          !flowData.trigger?.AvailableTrigger ||
          !flowData.actions
        ) {
          throw new Error("Incomplete flow data received from server.");
        }

        // Populate state from fetched data
        setSelectedTrigger({
          id: flowData.trigger.AvailableTrigger.id,
          name: flowData.trigger.AvailableTrigger.name,
          image: flowData.trigger.AvailableTrigger.image,
          // Assuming trigger metadata is not needed or handled differently
        });

        setSelectedActions(
          flowData.actions.map((act: Action, idx: number) => ({
            idx: idx + 2, // Start action index from 2
            availableActionId: act.AvailableAction.id,
            availableActionName: act.AvailableAction.name,
            availableActionImage: act.AvailableAction.image,
            metadata: act.metadata || {}, // Ensure metadata is an object
          }))
        );
        setFlowError("");
      })
      .catch((err) => {
        console.error("Error fetching flow:", err);
        setFlowError(
          err.response?.data?.error ||
            err.message ||
            "Failed to load flow data."
        );
        setSelectedTrigger(null); // Clear state on error
        setSelectedActions([]);
      })
      .finally(() => {
        setLoadingFlow(false);
      });
  }, [flowid]); // Re-fetch if flowid changes (shouldn't normally happen)

  // --- Event Handlers (Mostly same as Create Flow) ---

  function addActionSlot() {
    setSelectedActions((prevActions) => [
      ...prevActions,
      {
        idx:
          (prevActions.length > 0
            ? Math.max(...prevActions.map((a) => a.idx))
            : 1) + 1,
        availableActionId: "",
        availableActionName: "",
        availableActionImage: "",
        metadata: {},
      },
    ]);
  }

  function handleModalSelection(
    selectedItem: null | {
      name: string;
      id: string;
      metadata: any;
      image: string;
    }
  ) {
    if (selectedItem === null) {
      setModalForStep(null);
      return;
    }

    if (modalForStep === 1) {
      setSelectedTrigger(selectedItem);
    } else if (modalForStep !== null && modalForStep > 1) {
      setSelectedActions((prevActions) => {
        return prevActions.map((action) =>
          action.idx === modalForStep
            ? {
                ...action,
                availableActionId: selectedItem.id,
                availableActionName: selectedItem.name,
                availableActionImage: selectedItem.image,
                metadata: selectedItem.metadata || {},
              }
            : action
        );
      });
    }
    setModalForStep(null);
  }

  function removeAction(stepIndexToRemove: number) {
    setSelectedActions((prevActions) => {
      const filteredActions = prevActions.filter(
        (action) => action.idx !== stepIndexToRemove
      );
      return filteredActions.map((action, i) => ({
        ...action,
        idx: i + 2,
      }));
    });
  }

  // --- Update the Flow ---
  async function updateFlow() {
    setUpdateError("");
    if (!selectedTrigger?.id) {
      setUpdateError("Please select a trigger.");
      return;
    }
    if (
      selectedActions.length === 0 ||
      selectedActions.some((a) => !a.availableActionId)
    ) {
      setUpdateError(
        "Please select at least one action and configure all action steps."
      );
      return;
    }
    if (!flowid) {
      setUpdateError("Flow ID is missing.");
      return;
    }

    setIsUpdating(true);
    try {
      // --- Use the editFlow endpoint ---
      await axios.post(
        `${BACKEND_URL}/api/v1/flow/editFlow/${flowid}`, // <-- Correct endpoint
        {
          availableTriggerId: selectedTrigger.id,
          triggerMetaData: {},
          actions: selectedActions.map((action) => ({
            availableActionId: action.availableActionId,
            actionMetaData: action.metadata,
          })),
        },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      router.push("/dashboard"); // Redirect on success
    } catch (err: any) {
      console.error("Update error:", err);
      setUpdateError(
        err.response?.data?.error || "Failed to update flow. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  // --- Render ---
  // Combine loading states
  const isLoading = loadingAvailable || loadingFlow;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Edit Flow
        </h1>
        <DarkButton onClick={updateFlow}>
          {isUpdating ? "Updating..." : "Update Flow"}
        </DarkButton>
      </div>

      {updateError && (
        <div
          className="max-w-3xl mx-auto mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center"
          role="alert"
        >
          {updateError}
        </div>
      )}
      {flowError && ( // Show error if fetching the flow failed
        <div
          className="max-w-3xl mx-auto mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center"
          role="alert"
        >
          Error loading flow: {flowError}
        </div>
      )}
      {availableError && (
        <p className="text-center text-red-600">
          Error loading available steps: {availableError}
        </p>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}

      {/* Flow Steps - Render only if not loading and no major errors */}
      {!isLoading && !availableError && !flowError && (
        <div className="flex flex-col items-center space-y-4 max-w-xl mx-auto">
          {/* Trigger */}
          <FlowCell
            onClick={() => setModalForStep(1)}
            name={selectedTrigger?.name}
            index={1}
            image={selectedTrigger?.image || ""}
          />

          {/* Connecting Line + Actions */}
          {selectedActions.map((action) => (
            <>
              <div className="h-8 w-px bg-gray-300"></div>
              <FlowCell
                key={action.idx}
                onClick={() => setModalForStep(action.idx)}
                name={action.availableActionName}
                index={action.idx}
                image={action.availableActionImage || ""}
                removeAction={removeAction}
              />
            </>
          ))}

          {/* Connecting Line + Add Button */}
          {selectedTrigger && (
            <>
              <div className="h-8 w-px bg-gray-300"></div>
              <button
                onClick={addActionSlot}
                className="w-full max-w-xs sm:max-w-sm p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition duration-150 ease-in-out flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span>Add Action</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Modal */}
      {modalForStep !== null && (
        <Modal
          index={modalForStep}
          onSelect={handleModalSelection}
          availableItems={
            modalForStep === 1 ? availableTriggers : availableActions
          }
        />
      )}
    </div>
  );
}
