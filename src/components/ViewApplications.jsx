import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Button from "./Button";
import { useAuth } from "../useAuth";

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);

  // Auth values are now dynamic and reusable
  const { user_id, role, isLoggedIn, token } = useAuth();
  let isAdmin = role == "ADMIN";
  /**
   * Fetch adoption applications based on user role.
   * useCallback prevents function recreation on every render.
   */
  const fetchApplications = useCallback(async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/getApplications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        {
          user_id: user_id,
          role,
        }
      );

      setApplications(response.data.data);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    }
  }, [user_id, role]);

  /**
   * Update application status (APPROVED / REJECTED / WITHDRAWN)
   */
  const updateApplicationStatus = useCallback(
    async (applicationId, status) => {
      try {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/approveAdopt`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          {
            application_id: applicationId,
            status,
          }
        );

        // Refresh data after update
        fetchApplications();
      } catch (error) {
        console.error("Failed to update application", error);
      }
    },
    [fetchApplications]
  );

  /**
   * Initial data fetch
   */
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);
  if (applications.length == 0) return <div>No Applications Found...</div>;
  return (
    <div className="table-wrapper">
      <table className="styled-table">
        <thead>
          <tr>
            <th>Pet Name</th>
            <th>Species</th>
            <th>Gender</th>
            <th>Breed</th>
            {isAdmin && <th>Requested By</th>}
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((item) => (
            <tr key={item.adoption_id}>
              <td>{item.petname}</td>
              <td>{item.species}</td>
              <td>{item.gender}</td>
              <td>{item.breed}</td>
              {isAdmin && <td>{item.requestedBy}</td>}
              <td>{item.email}</td>

              <td>
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </td>

              <td className="actions">
                {isAdmin && item.status == "APPLIED" ? (
                  <>
                    <Button
                      text="Approve"
                      onClick={() =>
                        updateApplicationStatus(item.adoption_id, "APPROVED")
                      }
                    />

                    <Button
                      text="Reject"
                      onClick={() =>
                        updateApplicationStatus(item.adoption_id, "REJECTED")
                      }
                    />
                  </>
                ) : (
                  item.status !== "WITHDRAWN" &&
                  !isAdmin && (
                    <Button
                      text="Withdraw"
                      onClick={() =>
                        updateApplicationStatus(item.adoption_id, "WITHDRAWN")
                      }
                    />
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewApplications;
