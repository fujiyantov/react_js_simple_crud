import "./App.css";
import { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import PaginationFactory from "react-bootstrap-table2-paginator";
import { Spinner, Modal, Button, Image, Form } from "react-bootstrap";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal show file
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Modal show file
  const [addEmployee, setAddEmployee] = useState(false);
  const handleCloseEmployee = () => setAddEmployee(false);
  const handleShowEmployee = () => setAddEmployee(true);

  // Modal edit file
  const [editEmployee, setEditEmployee] = useState(false);
  const handleCloseEditEmployee = () => setEditEmployee(false);
  const handleShowEditEmployee = () => setEditEmployee(true);

  const [startDate, setStartDate] = useState(new Date());

  // Province
  const [province, setProvince] = useState(null);
  const [bank, setBank] = useState(null);
  const [position, setPosition] = useState(null);

  // City
  const [city, setCity] = useState(null);
  const [selectedValue, setSelectedValue] = useState();
  const [selectedValueCity, setSelectedValueCity] = useState();
  const [selectedValueBank, setSelectedValueBank] = useState();
  const [selectedValuePosition, setSelectedValuePosition] = useState();

  // File
  const [selectedFile, setSelectedFile] = useState(null);

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

  // Show employee
  const showData = async (employeeID) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/employees/" + employeeID
      );
      if (!response.ok) {
        throw new Error(`the status is ${response.status}`);
      }

      let actualData = await response.json();
      setDataEmployee(actualData);
      handleShowEditEmployee();
      setError(null);
    } catch (error) {
      setError(error.message);
      setData(null);
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
    } catch (error) {
      setError(error.message);
    } finally {
      getData();
    }
  };

  // Get Province
  const provinces = [];
  const getProvince = async () => {
    try {
      const response = await fetch(
        "http://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );
      if (!response.ok) {
        throw new Error(`the status is ${response.status}`);
      }
      let jsonProvince = await response.json();
      jsonProvince.forEach((element) => {
        provinces.push({
          value: element.id,
          label: element.name,
        });
      });

      setProvince(provinces);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setSelectedValue(e.value);
    getCity(e.value);
  };

  // Get City
  const cities = [];
  const getCity = async (provinceID) => {
    try {
      const response = await fetch(
        "https://www.emsifa.com/api-wilayah-indonesia/api/regencies/" +
          provinceID +
          ".json"
      );
      if (!response.ok) {
        throw new Error(`the status is ${response.status}`);
      }
      let jsonCtiy = await response.json();
      jsonCtiy.forEach((element) => {
        cities.push({
          value: element.id,
          label: element.name,
        });
      });

      setCity(cities);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChangeCity = (e) => {
    setSelectedValueCity(e.value);
  };

  // Get Bank
  const banks = [];
  const getBank = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/banks");
      if (!response.ok) {
        throw new Error(`the status is ${response.status}`);
      }
      let jsonBank = await response.json();
      jsonBank.forEach((element) => {
        banks.push({
          value: element.id,
          label: element.name,
        });
      });

      setBank(banks);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChangeBank = (e) => {
    setSelectedValueBank(e.value);
  };

  // Get position
  const positions = [];
  const getPosition = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/positions");
      if (!response.ok) {
        throw new Error(`the status is ${response.status}`);
      }
      let jsonPosition = await response.json();
      jsonPosition.forEach((element) => {
        positions.push({
          value: element.id,
          label: element.name,
        });
      });

      setPosition(positions);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChangePosition = (e) => {
    setSelectedValuePosition(e.value);
  };

  // store
  const [employee, setEmployee] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone_number: "",
    email: "",
    province_id: "",
    city_id: "",
    street: "",
    zip_code: "",
    ktp_number: "",
    ktp_file: "",
    position_id: "",
    bank_id: "",
    account_number: "",
  });

  const [dataEmployee, setDataEmployee] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone_number: "",
    email: "",
    province_id: "",
    city_id: "",
    street: "",
    zip_code: "",
    ktp_number: "",
    ktp_file: "",
    position_id: "",
    bank_id: "",
    account_number: "",
  });

  // sbmit store
  function submit(e) {
    e.preventDefault();

    const payload = new FormData();
    payload.append("first_name", employee.first_name);
    payload.append("last_name", employee.last_name);
    payload.append("date_of_birth", startDate.toISOString().split("T")[0]);
    payload.append("phone_number", employee.phone_number);
    payload.append("email", employee.email);
    payload.append("province_id", selectedValue);
    payload.append("city_id", selectedValueCity);
    payload.append("street", employee.street);
    payload.append("ktp_number", employee.ktp_number);
    payload.append("ktp_file", selectedFile);
    payload.append("zip_code", employee.zip_code);
    payload.append("position_id", selectedValuePosition);
    payload.append("bank_id", selectedValueBank);
    payload.append("account_number", employee.account_number);

    fetch("http://127.0.0.1:8000/api/employees", {
      method: "POST",
      body: payload,
    })
      .then((response) => {
        // console.log(response);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // handle data
  function handle(e) {
    const newEmployee = { ...employee };
    newEmployee[e.target.id] = e.target.value;
    setEmployee(newEmployee);
  }

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

  // Action delete
  let actionFieldDelete = (data, row) => {
    return (
      <Button
        variant="danger"
        onClick={() => {
          deleteData(data);
        }}
      >
        Delete
      </Button>
    );
  };

  // Action edit
  let actionFieldEdit = (data, row) => {
    return (
      <Button
        variant="secondary"
        onClick={() => {
          showData(data);
        }}
      >
        Edit
      </Button>
    );
  };

  const columns = [
    { dataField: "name", text: "Name", filter: textFilter() },
    { dataField: "phone_number", text: "Phone" },
    { dataField: "date_of_birth", text: "DOB" },
    { dataField: "street", text: "Address" },
    { dataField: "position", text: "Current Position", filter: textFilter() },
    { dataField: "ktp_file", text: "KTP FILE", formatter: shwoKtpFile },
    { dataField: "id", text: "Action", formatter: actionFieldEdit },
    { dataField: "id", text: "Action", formatter: actionFieldDelete },
  ];

  useEffect(() => {
    getData();
    getProvince();
    getBank();
    getPosition();
  }, []);

  return (
    <div>
      <div className="container">
        <h1 className="my-3">Employee Collection</h1>
        {loading && <div>loading...</div>}
        {error && <div>There is any error status in - ${error}</div>}

        <Button
          className="mb-3"
          onClick={() => {
            handleShowEmployee();
          }}
        >
          Add Employee
        </Button>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            pagination={PaginationFactory()}
            filter={filterFactory()}
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

      {/* Modal Add */}
      <Modal show={addEmployee} onHide={handleCloseEmployee}>
        <Form>
          <Modal.Header closeButton>
            <Modal.Title>Add Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                onChange={(e) => handle(e)}
                id="first_name"
                value={employee.first_name}
                type="text"
                placeholder="Enter first name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                onChange={(e) => handle(e)}
                id="last_name"
                value={employee.last_name}
                type="text"
                placeholder="Enter last name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <DatePicker
                className="form-control"
                dateFormat={`yyyy-MM-dd`}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                onChange={(e) => handle(e)}
                id="phone_number"
                value={employee.phone_number}
                type="number"
                placeholder="Enter Phone Number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                onChange={(e) => handle(e)}
                id="email"
                value={employee.email}
                type="email"
                placeholder="Enter email"
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Provice</Form.Label>
              <Select options={province} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Select options={city} onChange={handleChangeCity} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Street</Form.Label>
              <Form.Control
                onChange={(e) => handle(e)}
                id="street"
                value={employee.street}
                as="textarea"
                rows={3}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                onChange={(e) => handle(e)}
                id="zip_code"
                value={employee.zip_code}
                type="number"
                placeholder="Enter zip code"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bank</Form.Label>
              <Select options={bank} onChange={handleChangeBank} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                onChange={(e) => handle(e)}
                id="account_number"
                value={employee.account_number}
                type="number"
                placeholder="Enter account number"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>KTP Number</Form.Label>
              <Form.Control
                onChange={(e) => handle(e)}
                id="ktp_number"
                value={employee.ktp_number}
                type="text"
                placeholder="Enter KTP number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Attacth</Form.Label>
              <Form.Control
                type="file"
                placeholder="Select file"
                required
                // value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Position</Form.Label>
              <Select options={position} onChange={handleChangePosition} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={(e) => {
                submit(e);
              }}
            >
              Submit
            </Button>

            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Edit */}
      <Modal show={editEmployee} onHide={handleCloseEditEmployee}>
        <Form>
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                // onChange={(e) => handle(e)}
                value={dataEmployee.first_name}
                type="text"
                placeholder="Enter first name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                // onChange={(e) => handle(e)}
                value={dataEmployee.last_name}
                type="text"
                placeholder="Enter last name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <DatePicker
                className="form-control"
                dateFormat={`yyyy-MM-dd`}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                // onChange={(e) => handle(e)}
                value={dataEmployee.phone_number}
                type="text"
                placeholder="Enter Phone Number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                // onChange={(e) => handle(e)}
                value={dataEmployee.email}
                type="email"
                placeholder="Enter email"
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Provice</Form.Label>
              <Select options={province} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Select options={city} onChange={handleChangeCity} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Street</Form.Label>
              <Form.Control
                // onChange={(e) => handle(e)}
                value={dataEmployee.street}
                as="textarea"
                rows={3}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                // onChange={(e) => handle(e)}
                value={dataEmployee.zip_code}
                type="number"
                placeholder="Enter zip code"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bank</Form.Label>
              <Select options={bank} onChange={handleChangeBank} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                // onChange={(e) => handle(e)}
                value={dataEmployee.account_number}
                type="number"
                placeholder="Enter account number"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>KTP Number</Form.Label>
              <Form.Control
                // onChange={(e) => handle(e)}
                value={dataEmployee.ktp_number}
                type="text"
                placeholder="Enter KTP number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Attacth</Form.Label>
              <Form.Control
                type="file"
                placeholder="Select file"
                required
                // value={selectedFile}
                // onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Position</Form.Label>
              <Select options={position} onChange={handleChangePosition} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={(e) => {
                submit(e);
              }}
            >
              Submit
            </Button>
            <Button variant="secondary" onClick={handleCloseEditEmployee}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
