import "./App.css";
import { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import PaginationFactory from "react-bootstrap-table2-paginator";
import { Spinner, Modal, Button, Image } from "react-bootstrap";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal show file
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Fetch employee
  const getData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/employees");
      if (!response.ok) {
        throw new Error(`the status is ${response.status}`);
      }

      let actualData = await response.json();
      setData(actualData.data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Delete employee
  const deleteData = async (data) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/employees/" + data,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`the status is ${response.status}`);
      }
      console.log(response);
    } catch (error) {
      setError(error.message);
    } finally {
      getData();
    }
  };

  // ktp modal file
  let shwoKtpFile = (data, row) => {
    return (
      <Button
        onClick={() => {
          handleShow();
          setFile(data);
        }}
      >
        View
      </Button>
    );
  };

  // action
  let actionField = (data, row) => {
    return (
      <Button
        variant="danger"
        onClick={() => {
          console.log(data);
          deleteData(data);
        }}
      >
        Delete
      </Button>
    );
  };

  const columns = [
    { dataField: "name", text: "Fist Name" },
    { dataField: "phone_number", text: "Phone" },
    { dataField: "date_of_birth", text: "DOB" },
    { dataField: "street", text: "Address" },
    { dataField: "position", text: "Current Position" },
    { dataField: "ktp_file", text: "KTP FILE", formatter: shwoKtpFile },
    { dataField: "id", text: "Action", formatter: actionField },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>Filter</h1>
      {loading && <div>wait a moment...</div>}
      {error && <div>There is any error status in - ${error}</div>}

      <div className="container">
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            pagination={PaginationFactory()}
          />
        )}
      </div>

      {/* Modal File */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>KTP File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={file} thumbnail fluid alt="image not found" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
