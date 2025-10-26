"use client";
import { DarkButton } from "@/components/buttons/DarkButton";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useAuthRedirect, { BACKEND_URL, HOOKS_URL } from "../config";
import { LinkButton } from "@/components/buttons/LinkButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import ModalFlowrun from "@/components/ModalFlowrun";

//the type of data returned by the backend, got from postman
interface Flow {
  id: string;
  triggerId: string;
  userId: number;
  date: Date;
  actions: {
    id: string;
    flowId: string;
    actionId: string;
    sortingOrder: number;
    AvailableAction: {
      id: string;
      name: string;
      image: string;
    };
  }[];
  trigger: {
    id: string;
    flowId: string;
    triggerId: string;
    AvailableTrigger: {
      id: string;
      name: string;
      image: string;
    };
  };
}

function useFlows() {
  const [loading, setLoading] = useState(true);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }

    axios
      .get(`${BACKEND_URL}/api/v1/flow`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setFlows(res.data.flows || []); // Ensure flows is always an array
      })
      .catch((err) => {
        console.error("Error fetching flows:", err);
        setError(
          err.response?.data?.error || err.message || "Failed to load flows."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return { loading, flows, setFlows, error };
}

export default function DashboardPage() {
  useAuthRedirect(); // Handles redirect if not authenticated
  const { loading, flows, setFlows, error } = useFlows();
  const router = useRouter();
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

  function closeModal() {
    setSelectedFlowId(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            My Flows
          </h1>
          <DarkButton onClick={() => router.push("/flow/create")}>
            + Create Flow
          </DarkButton>
        </div>

        {/* Loading State */}
        {loading && (
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

        {/* Error is there */}
        {!loading && error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* Flow List Table */}
        {!loading && !error && flows.length > 0 && (
          <FlowTable
            flows={flows}
            setFlows={setFlows}
            setSelectedFlowId={setSelectedFlowId}
          />
        )}

        {/* No flows there yet */}
        {!loading && !error && flows.length === 0 && (
          <div className="text-center py-16 px-4 bg-white shadow rounded-lg border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No flows created yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first automated workflow.
            </p>
            <div className="mt-6">
              <DarkButton onClick={() => router.push("/flow/create")}>
                + Create Flow
              </DarkButton>
            </div>
          </div>
        )}

        {/* Modal */}
        {selectedFlowId && (
          <ModalFlowrun flowId={selectedFlowId} onSelect={closeModal} />
        )}
      </div>
    </div>
  );
}

// Flow Table
function FlowTable({
  flows,
  setFlows,
  setSelectedFlowId,
}: {
  flows: Flow[];
  setFlows: Dispatch<SetStateAction<Flow[]>>;
  setSelectedFlowId: Dispatch<SetStateAction<string | null>>;
}) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  // get user ID from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id || decoded.sub || null);
      } catch (e) {
        console.error("Failed to decode token:", e);
      }
    }
  }, []);

  const handleDelete = async (flowId: string) => {
    if (!window.confirm("Are you sure you want to delete this flow?")) {
      return;
    }

    try {
      await axios.delete(`${BACKEND_URL}/api/v1/flow/${flowId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setFlows((currentFlows) =>
        currentFlows.filter((flow) => flow.id !== flowId)
      );
    } catch (err) {
      console.error("Failed to delete flow:", err);
      alert("Failed to delete flow. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Flow Steps
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Webhook URL
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {flows.map((flow) => (
            <tr key={flow.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  {/* Trigger Icon */}
                  {flow.trigger?.AvailableTrigger?.image && (
                    <Image
                      src={flow.trigger.AvailableTrigger.image}
                      alt={flow.trigger.AvailableTrigger.name}
                      width={24}
                      height={24}
                      className="rounded"
                      title={flow.trigger.AvailableTrigger.name} // Tooltip
                    />
                  )}
                  {/* Action Icons */}
                  {flow.actions.map(
                    (action) =>
                      action.AvailableAction?.image && (
                        <Image
                          key={action.id}
                          src={action.AvailableAction.image}
                          alt={action.AvailableAction.name}
                          width={24}
                          height={24}
                          className="rounded"
                          title={action.AvailableAction.name} // Tooltip
                        />
                      )
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {flow.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(flow.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {userId ? (
                  // Basic copy-to-clipboard functionality
                  <button
                    title="Click to copy Webhook URL"
                    className="truncate hover:underline focus:outline-none"
                    onClick={() => {
                      const url = `${HOOKS_URL}/hooks/catch/${userId}/${flow.id}`;
                      navigator.clipboard.writeText(url).then(
                        () => {
                          alert("Webhook URL copied!"); // Simple confirmation
                        },
                        (err) => {
                          console.error("Failed to copy text: ", err);
                          alert("Failed to copy URL.");
                        }
                      );
                    }}
                  >
                    {`${HOOKS_URL}/hooks/catch/${userId}/${flow.id.substring(0, 8)}...`}
                  </button>
                ) : (
                  <span>Loading...</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                <LinkButton
                  onClick={() => router.push(`/flow/edit/${flow.id}`)}
                >
                  Edit
                </LinkButton>
                <LinkButton
                  onClick={() => handleDelete(flow.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </LinkButton>
                <LinkButton onClick={() => setSelectedFlowId(flow.id)}>
                  Runs
                </LinkButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
