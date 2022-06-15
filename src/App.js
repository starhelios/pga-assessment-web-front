import { ChakraProvider, IconButton } from "@chakra-ui/react";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import styled from "styled-components";
import { BookModal, CancelBook } from "./Modal";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data, setSelectRow, openModal, cancelBook }) {
  const [isCancelAlert, setIsCancelAlert] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  const getRowValue = (row) => {
    setSelectRow(row.original);
    if (!row.original._id) {
      openModal();
    } else {
      setSelectedSchedule(row.original._id);
      setIsCancelAlert(true);
    }
  };

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
            <th></th>
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
              {!row.original._id ? (
                <td>
                  <IconButton
                    aria-label="Book"
                    icon={<FaCheck />}
                    onClick={() => getRowValue(row)}
                  />
                </td>
              ) : (
                <td>
                  <IconButton
                    aria-label="Cancel Book"
                    icon={<FaTrashAlt />}
                    onClick={() => getRowValue(row)}
                  />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
      <CancelBook
        isOpen={isCancelAlert}
        onClose={() => setIsCancelAlert(false)}
        onClick={() => {
          setIsCancelAlert(false);
          cancelBook(selectedSchedule);
        }}
      />
    </table>
  );
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [tableData, setTableData] = useState([
    {
      time: "8:00 AM",
      name: "",
      phone: "",
    },
    {
      time: "8:30 AM",
      name: "",
      phone: "",
    },
    {
      time: "9:00 AM",
      name: "",
      phone: "",
    },
    {
      time: "9:30 AM",
      name: "",
      phone: "",
    },
    {
      time: "10:00 AM",
      name: "",
      phone: "",
    },
    {
      time: "10:30 AM",
      name: "",
      phone: "",
    },
    {
      time: "11:00 AM",
      name: "",
      phone: "",
    },
    {
      time: "11:30 AM",
      name: "",
      phone: "",
    },
    {
      time: "12:00 PM",
      name: "",
      phone: "",
    },
    {
      time: "12:30 PM",
      name: "",
      phone: "",
    },
    {
      time: "1:00 PM",
      name: "",
      phone: "",
    },
    {
      time: "1:30 PM",
      name: "",
      phone: "",
    },
    {
      time: "2:00 PM",
      name: "",
      phone: "",
    },
    {
      time: "2:30 PM",
      name: "",
      phone: "",
    },
    {
      time: "3:00 PM",
      name: "",
      phone: "",
    },
    {
      time: "3:30 PM",
      name: "",
      phone: "",
    },
    {
      time: "4:00 PM",
      name: "",
      phone: "",
    },
  ]);

  const columns = useMemo(
    () => [
      {
        Header: "The Swing Doctor - Appointment Sign Up",
        columns: [
          {
            Header: "Time",
            accessor: "time",
          },
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Phone Number",
            accessor: "phone",
          },
        ],
      },
    ],
    []
  );

  const fetchSchedules = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}api/all`);
    const tempData = tableData.map((_data) => {
      const originData = data.data.find((_d) => _d.time === _data.time);
      if (originData) {
        _data = { ...originData };
      }
      return _data;
    });
    setTableData(tempData);
  };

  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBook = (time, name, phone) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}api/create`, {
        time,
        name,
        phone,
      })
      .then((res) => {
        const { data } = res;
        const tempData = tableData.map((_data) => {
          if (_data.time === data.time) {
            _data = { ...data, _id: data.id };
          }
          return _data;
        });
        setTableData(tempData);
        setIsOpen(false);
      });
  };

  const cancelBook = (id) => {
    const tempData = tableData.map((_data) => {
      if (_data._id === id) {
        _data = { ..._data, _id: "", name: "", phone: "" };
      }
      return _data;
    });
    setTableData(tempData);
    axios.post(`${process.env.REACT_APP_API_URL}api/cancel`, { id });
  };

  return (
    <ChakraProvider>
      <Styles>
        <Table
          columns={columns}
          data={tableData}
          setSelectRow={setSelectedRow}
          openModal={() => setIsOpen(true)}
          cancelBook={cancelBook}
        />
      </Styles>
      <BookModal
        isOpen={isOpen}
        data={selectedRow}
        onClick={handleBook}
        onClose={() => setIsOpen(false)}
      />
    </ChakraProvider>
  );
}

export default App;
