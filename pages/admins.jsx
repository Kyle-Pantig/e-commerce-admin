import Layout from "@/components/Layout";
import ProductLoader from "@/components/Loader/ProductLoader";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

const AdminPage = ({ swal }) => {
  const [email, setEmail] = useState("");
  const [adminEmails, setAdminEmails] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const addAdmin = (event) => {
    event.preventDefault();
    axios
      .post("/api/admins", { email })
      .then((response) => {
        console.log(response.data);
        swal.fire({
          title: "Admin created",
          icon: "success",
        });
        setEmail("");
        loadAdmins();
      })
      .catch((error) => {
        swal.fire({
          title: "Error!",
          text: error.response.data.message,
          icon: "error",
        });
      });
  };

  const loadAdmins = () => {
    setisLoading(true);
    axios.get("/api/admins").then((response) => {
      setAdminEmails(response.data);
      setisLoading(false);
    });
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const deleteAdmin = (_id, email) => {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${email}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes",
        reverseButtons: true,
        confirmButtonColor: "#d55",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          axios.delete("/api/admins?_id=" + _id).then(() => {
            swal.fire({
              title: "Admin deleted",
              icon: "success",
            });
            loadAdmins();
          });
        }
      });
  };

  return (
    <Layout>
      <h1 className="mb-2 font-bold">Admins</h1>
      <h1 className="mb-2 mt-6">Add new admin</h1>
      <form onSubmit={addAdmin}>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="example@gmail.com"
            className="mb-0"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Add admin
          </button>
        </div>
      </form>
      <h1 className="mb-2 mt-6">Existing admins</h1>
      <table className="basic mt-4">
        <thead>
          <tr>
            <th>Admin google email</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={2}>
                <ProductLoader />
              </td>
            </tr>
          ) : (
            <>
              {adminEmails.length > 0 &&
                adminEmails.map((adminEmail) => (
                  <tr key={adminEmail._id}>
                    <td>{adminEmail.email}</td>
                    <td>
                      {adminEmail.createdAt &&
                        new Date(adminEmail.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          deleteAdmin(adminEmail._id, adminEmail.email)
                        }
                        className="btn-red"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </>
          )}
        </tbody>
      </table>
    </Layout>
  );
};

export default withSwal(({ swal }) => <AdminPage swal={swal} />);
