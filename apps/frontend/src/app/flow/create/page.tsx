"use client";

import useAuthRedirect, { BACKEND_URL } from "@/app/config";
import Modal from "@/components/Modal";
import { FlowCell } from "@/components/FlowCell";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DarkButton } from "@/components/buttons/DarkButton";

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
export default function CreateFlowPage() {
  useAuthRedirect();
  const router = useRouter();
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
  }>();

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

  const [modalForStep, setModalForStep] = useState<null | number>(null); // Step index (1 for trigger, 2+ for actions)
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  // Add a new empty action slot
  function addActionSlot() {
    setSelectedActions((prevActions) => [
      ...prevActions,
      {
        idx:
          (prevActions.length > 0
            ? Math.max(...prevActions.map((a) => a.idx))
            : 1) + 1, // Ensure unique, sequential index
        availableActionId: "",
        availableActionName: "",
        availableActionImage: "",
        metadata: {},
      },
    ]);
  }

  // Handle selection from the modal
  function handleModalSelection(
    selectedItem: null | {
      name: string;
      id: string;
      metadata: any;
      image: string;
    }
  ) {
    if (selectedItem === null) {
      // Modal closed without selection
      setModalForStep(null);
      return;
    }

    if (modalForStep === 1) {
      // Trigger selected
      setSelectedTrigger(selectedItem);
    } else if (modalForStep !== null && modalForStep > 1) {
      // Action selected
      setSelectedActions((prevActions) => {
        return prevActions.map((action) =>
          action.idx === modalForStep
            ? {
                ...action,
                availableActionId: selectedItem.id,
                availableActionName: selectedItem.name,
                availableActionImage: selectedItem.image,
                metadata: selectedItem.metadata || {}, // Store metadata if provided
              }
            : action
        );
      });
    }
    setModalForStep(null); // Close modal
  }

  // Remove an action and re-index subsequent actions
  function removeAction(stepIndexToRemove: number) {
    setSelectedActions((prevActions) => {
      const filteredActions = prevActions.filter(
        (action) => action.idx !== stepIndexToRemove
      );
      // Re-index remaining actions sequentially starting from 2
      return filteredActions.map((action, i) => ({
        ...action,
        idx: i + 2, // Index 2, 3, 4...
      }));
    });
  }

  // Publish the flow
  async function publishFlow() {
    setPublishError("");
    if (!selectedTrigger?.id) {
      setPublishError("Please select a trigger.");
      return;
    }
    if (
      selectedActions.length === 0 ||
      selectedActions.some((a) => !a.availableActionId)
    ) {
      setPublishError(
        "Please select at least one action and configure all action steps."
      );
      return;
    }

    setIsPublishing(true);
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/flow/createFlow`,
        {
          availableTriggerId: selectedTrigger.id,
          triggerMetaData: {}, // Add trigger metadata if needed
          actions: selectedActions.map((action) => ({
            availableActionId: action.availableActionId,
            actionMetaData: action.metadata,
            // Ensure sortingOrder is passed if your backend needs it explicitly
            // sortingOrder: action.idx - 1 // Example if 0-based index needed
          })),
        },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      router.push("/dashboard"); // Redirect on success
    } catch (err: any) {
      console.error("Publish error:", err);
      setPublishError(
        err.response?.data?.error || "Failed to publish flow. Please try again."
      );
    } finally {
      setIsPublishing(false);
    }
  }

  // --- Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Create New Flow
        </h1>
        <DarkButton onClick={publishFlow}>
          {isPublishing ? "Publishing..." : "Publish Flow"}
        </DarkButton>
      </div>

      {publishError && (
        <div
          className="max-w-3xl mx-auto mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center"
          role="alert"
        >
          {publishError}
        </div>
      )}

      {loadingAvailable && (
        <p className="text-center text-gray-600">Loading available steps...</p>
      )}
      {availableError && (
        <p className="text-center text-red-600">Error: {availableError}</p>
      )}

      {/* Flow Steps */}
      {!loadingAvailable && !availableError && (
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
              {/* Vertical connecting line */}
              <div className="h-8 w-px bg-gray-300"></div>

              <FlowCell
                key={action.idx} // Use a stable key if possible, idx might change on delete
                onClick={() => setModalForStep(action.idx)}
                name={action.availableActionName}
                index={action.idx}
                image={action.availableActionImage || ""}
                removeAction={removeAction}
              />
            </>
          ))}

          {/* Connecting Line + Add Button */}
          {selectedTrigger && ( // Show add button only after trigger is selected
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
