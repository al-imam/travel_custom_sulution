import axios from "axios";
import Widget from "components/widget/Widget";
import { AnimatePresence, motion } from "framer-motion";
import useAgent from "hook/UseAgent";
import useAllform from "hook/useAllform";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NormalSelect from "react-select";
import { toast } from "react-toastify";
import Table from "../payment/table";

const StyleSelect = {
  control: (styles, state) => ({
    ...styles,
    margin: 0,
    padding: 2,
    backgroundColor: "rgb(248 249 250)",
    borderColor: state.isFocused ? "rgb(59 130 246 / 0.5)" : state.isDisabled ? "rgb(233 227 255)" : "rgb(192 184 254)",
    borderWidth: 1.5,
    opacity: state.isDisabled ? "0.5" : 1,
    "&:hover": {
      borderColor: "none",
    },
    boxShadow: state.isFocused ? "0 0 0 1px rgb(59 130 246 / 0.5)" : "none",
  }),
  placeholder: (styles) => ({
    ...styles,
    whiteSpace: "nowrap",
    fontSize: "0.875rem",
    overflow: "hidden",
    color: "#adb5bd",
    letterSpacing: "0.3px",
    userSelect: "none",
  }),
  valueContainer: (styles) => ({
    ...styles,
    userSelect: "none",
    color: "rgb(27 37 89)",
  }),
};

const CountySeletData = ["singapore", "schengen", "thailand"];

const Index = () => {
  const [SelectedCountry, setSelectedCountry] = useState([]);
  // basic data load
  const { data, loading: agentLoading, error: agenterror } = useAgent();

  const [allSingapore, singaporLoad, singaporeError, reloadSingapore] = useAllform("singapore");

  const [allthailand, thailandLoad, thailandError, reloadthailand] = useAllform("thailand");

  const [allschengen, schengenLoad, schengenError, reloadschengen] = useAllform("schengen");

  const colunm = useMemo(() => {
    return {
      schengen: [
        {
          Header: "ID",
          accessor: "id", // accessor is the "key" in the data
        },
        {
          Header: "Name",
          accessor: "name",
          Cell: (prop) => {
            return prop.row.original.surname + " " + prop.row.original.first_name;
          },
        },
        {
          Header: "Passport Number",
          accessor: "passport_number",
        },
        {
          Header: "Passport Type",
          accessor: "type_of_travel_document",
        },
        {
          Header: "Agent",
          accessor: "apply_by",
          Cell: (prop) => {
            const User = JSON.parse(prop.row.original.apply_by);
            return <span className={`${User.type === "Admin" ? "text-green-500" : "text-red-500"}`}>{User.email}</span>;
          },
        },
        {
          Header: "Status",
          accessor: "status",
        },
        {
          Header: "Action",
          accessor: "action",
          Cell: (prop) => (
            <Action prop={{ ...prop }} SelectedCountry={SelectedCountry} reloadSingapore={reloadschengen} />
          ),
        },
      ],
      thailand: [
        {
          Header: "ID",
          accessor: "id", // accessor is the "key" in the data
        },
        {
          Header: "Name",
          accessor: "name",
          Cell: (prop) => {
            return prop.row.original.first_name + " " + prop.row.original.middle_name;
          },
        },
        {
          Header: "Passport Number",
          accessor: "passport_number",
        },
        {
          Header: "Passport Type",
          accessor: "type_of_passport",
        },
        {
          Header: "Agent",
          accessor: "apply_by",
          Cell: (prop) => {
            const User = JSON.parse(prop.row.original.apply_by);
            return <span className={`${User.type === "Admin" ? "text-green-500" : "text-red-500"}`}>{User.email}</span>;
          },
        },
        {
          Header: "Status",
          accessor: "status",
        },
        {
          Header: "Action",
          accessor: "action",
          Cell: (prop) => (
            <Action prop={{ ...prop }} SelectedCountry={SelectedCountry} reloadSingapore={reloadthailand} />
          ),
        },
      ],
      singapore: [
        {
          Header: "ID",
          accessor: "id", // accessor is the "key" in the data
        },
        {
          Header: "Name",
          accessor: "name",
          Cell: (prop) => {
            return prop.row.original.name + " " + prop.row.original.alias;
          },
        },
        {
          Header: "Passport Number",
          accessor: "passport_number",
        },
        {
          Header: "Travel Date",
          accessor: "expected_date_of_arrival",
        },
        {
          Header: "Agent",
          accessor: "apply_by",
          Cell: (prop) => {
            const User = JSON.parse(prop.row.original.apply_by);
            return <span className={`${User.type === "Admin" ? "text-green-500" : "text-red-500"}`}>{User.email}</span>;
          },
        },
        {
          Header: "Status",
          accessor: "status",
        },
        {
          Header: "Action",
          accessor: "action",
          Cell: (prop) => (
            <Action prop={{ ...prop }} SelectedCountry={SelectedCountry} reloadSingapore={reloadSingapore} />
          ),
        },
      ],
    };
  }, [SelectedCountry]);
  // selected country data
  const [SelectedCountryData, SetSelectedCountryData] = useState([]);
  const [SelectedCountryDatatemp, SetSelectedCountryDatatemp] = useState([]);
  useEffect(() => {
    if (SelectedCountry === "singapore") {
      SetSelectedCountryData(allSingapore);
      SetSelectedCountryDatatemp(allSingapore);
      // SetfilterStatus('')
      // SetfilterAgent('')
    }
    if (SelectedCountry === "schengen") {
      SetSelectedCountryData(allschengen);
      SetSelectedCountryDatatemp(allschengen);
      // SetfilterStatus('')
      // SetfilterAgent('')
    }
    if (SelectedCountry === "thailand") {
      SetSelectedCountryData(allthailand);
      SetSelectedCountryDatatemp(allthailand);
      // SetfilterStatus('')
      // SetfilterAgent('')
    }
  }, [SelectedCountry, allSingapore, allthailand, allschengen]);

  let col = [];

  switch (SelectedCountry) {
    case "singapore":
      col = colunm.singapore;
      break;

    case "schengen":
      col = colunm.schengen;
      break;
    case "thailand":
      col = colunm.thailand;
      break;
    default:
      col = [];
  }
  // filter the data
  const [filterStatus, SetfilterStatus] = useState("");
  const [filterAgent, SetfilterAgent] = useState("");

  const filter = useMemo(() => {
    return SelectedCountryDatatemp.filter((e) => {
      if (!filterStatus) {
        return true;
      }
      return e.status === filterStatus;
    }).filter((e) => {
      if (!filterAgent) {
        return true;
      }
      return JSON.parse(e.apply_by).email === filterAgent;
    });
    // SetSelectedCountryData(temp)
  }, [filterStatus, filterAgent, SelectedCountryDatatemp]);

  return (
    <div className="relative w-full pt-7">
      {/* status  */}
      <div className="relative flex w-full justify-between gap-2">
        <Widget
          icon={<TwemojiFlagForFlagSingapore className="text-2xl " />}
          title={"Singapore"}
          subtitle={singaporLoad ? <SvgSpinnersPulseRings3 /> : allSingapore.length}
        />

        <Widget
          icon={<TwemojiFlagForFlagEuropeanUnion className="text-2xl " />}
          title={"Schengen"}
          subtitle={schengenLoad ? <SvgSpinnersPulseRings3 /> : allschengen.length}
        />
        <Widget
          icon={<EmojioneV1FlagForThailand className="text-2xl " />}
          title={"Thailand"}
          subtitle={thailandLoad ? <SvgSpinnersPulseRings3 /> : allthailand.length}
        />
      </div>
      <div className="my-2 p-3">
        <div>
          <h1 className="flex items-center justify-start text-xl text-brand-400">
            {" "}
            <span className="pr-2">
              <SolarPenNewRoundLineDuotone />
            </span>
            Entry
          </h1>
          <div className="relative flex w-full items-center justify-start gap-2">
            <Link
              to={"/entry/singapore"}
              className="cursor-pointer rounded-md bg-brand-300 py-1 px-3 text-white ring-brand-500 hover:bg-brand-400 hover:ring-1"
            >
              Singapore
            </Link>
            <Link
              to={"/entry/thailand"}
              className="cursor-pointer rounded-md bg-brand-300 py-1 px-3 text-white ring-brand-500 hover:bg-brand-400 hover:ring-1"
            >
              Thailand
            </Link>
            <Link
              to={"/entry/schengen"}
              className="cursor-pointer rounded-md bg-brand-300 py-1 px-3 text-white ring-brand-500 hover:bg-brand-400 hover:ring-1"
            >
              Schengen
            </Link>
          </div>
        </div>
      </div>
      <div className="relative w-full p-3">
        <span className="text-xl text-gray-900 dark:text-brand-50">Choose Country:</span>
        <NormalSelect
          onChange={(e) => {
            setSelectedCountry(e.value);
          }}
          placeholder="Download Form"
          value={{ label: SelectedCountry, value: SelectedCountry }}
          options={CountySeletData.map((e) => {
            return { label: e.toUpperCase(), value: e };
          })}
          styles={StyleSelect}
        />
      </div>
      <AnimatePresence>
        {SelectedCountryData.length ? (
          <motion.div
            initial={{
              opacity: 0,
              top: -10,
            }}
            whileInView={{
              opacity: 1,
              top: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
            }}
            exit={{
              opacity: 0,
              top: 10,
            }}
            className="relative w-full"
          >
            <div className="relative mt-3 flex w-full justify-between gap-3">
              <Widget
                icon={<LineMdDocumentList className="text-2xl" />}
                title={"Total"}
                subtitle={SelectedCountryData.length}
              />
              <Widget
                icon={<LineMdDocumentList className="text-2xl" />}
                title={"Pending"}
                subtitle={SelectedCountryData.filter((e) => e.status === "pending").length}
              />
              <Widget
                icon={<LineMdDocumentList className="text-2xl" />}
                title={"Approved"}
                subtitle={SelectedCountryData.filter((e) => e.status === "approved").length}
              />
              <Widget
                icon={<LineMdDocumentList className="text-2xl" />}
                title={"Rejected"}
                subtitle={SelectedCountryData.filter((e) => e.status === "rejected").length}
              />
            </div>

            {/* table  */}
            <div className="relative mt-6 w-full">
              <div className="relative grid w-full grid-cols-3 gap-3 p-3">
                <div className="relative w-full ">
                  <label className="text-gray-900 dark:text-brand-50">Filter Status</label>
                  <NormalSelect
                    onChange={(e) => {
                      SetfilterStatus(e.value);
                    }}
                    value={{ label: filterStatus, value: filterStatus }}
                    options={[
                      { label: "none", value: "" },
                      { label: "Pending", value: "pending" },
                      { label: "Approved", value: "approved" },
                    ]}
                    styles={StyleSelect}
                  />
                </div>
                <div className="relative w-full">
                  <label className="flex items-center text-gray-900 dark:text-brand-50">
                    Filter Agent
                    {agenterror && (
                      <span className="pl-1 text-xl shadow-red-400 drop-shadow-md">
                        <OpenmojiWarning />
                      </span>
                    )}
                    {agentLoading && (
                      <span className="pl-1 text-xl shadow-red-400 drop-shadow-md">
                        <SvgSpinnersPulseRings3 />
                      </span>
                    )}
                  </label>
                  <NormalSelect
                    onChange={(e) => {
                      SetfilterAgent(e.value);
                    }}
                    value={{ label: filterAgent, value: filterAgent }}
                    options={
                      data.length
                        ? [{ label: "none", value: "" }, ...data.map((e) => ({ label: e.email, value: e.email }))]
                        : []
                    }
                    styles={StyleSelect}
                  />
                </div>
              </div>
              {/* // "singapore", "schengen", "thailand" */}
              <Table colunm={col} datas={filter} />
            </div>
          </motion.div>
        ) : (
          ""
        )}
      </AnimatePresence>
      {!SelectedCountryData.length ? (
        <motion.div
          initial={{
            opacity: 0,
            top: 10,
          }}
          whileInView={{
            opacity: 1,
            top: 0,
          }}
          transition={{
            duration: 1,
            ease: "backIn",
            delay: 0.02,
          }}
          className="relative w-full"
        >
          <div className="relative flex h-60 w-full flex-col items-center justify-center">
            <span className="text-7xl text-brand-400">
              <LineMdCoffeeLoop />
            </span>
            <p className="relative text-xl font-extralight -tracking-wide">
              No data Found. Please Select a Country or Another Country
            </p>
          </div>
        </motion.div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Index;

const Action = ({ prop, SelectedCountry, reloadSingapore }) => {
  // approve controller =>
  const Approved = async (country, id) => {
    // return alert(SelectedCountry);
    try {
      const serverRes = await toast.promise(
        axios.post("/api/visa-form/approved", {
          country,
          id,
        }),
        {
          pending: "Please Wait ...",
          error: "Something is Wrong!",
          success: "Request Accepted",
        }
      );

      reloadSingapore();
    } catch (error) {
      console.log("🚀 ~ file: Index.jsx:340 ~ Approved ~ error:", error);
    }
  };
  // approve controller =>
  const Reject = async (country, id) => {
    // return alert(SelectedCountry);
    try {
      const serverRes = await toast.promise(
        axios.post("/api/visa-form/Reject", {
          country,
          id,
        }),
        {
          pending: "Please Wait ...",
          error: "Something is Wrong!",
          success: "Request Rejected",
        }
      );

      reloadSingapore();
    } catch (error) {
      console.log("🚀 ~ file: Index.jsx:340 ~ Approved ~ error:", error);
    }
  };
  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => {
          Reject(SelectedCountry, prop.row.original.id);
        }}
        title="Reject Request"
        className={`text-md rounded-full bg-red-200 p-2 text-red-800 ring-1 ring-red-700 transition-all duration-500 hover:scale-105 hover:shadow-md ${
          prop.row.original.status === "approved" || prop.row.original.status === "rejected" ? "hidden" : ""
        }`}
      >
        <TdesignFileBlocked />
      </button>
      <button
        onClick={() => {
          Approved(SelectedCountry, prop.row.original.id);
        }}
        title="Accept Request"
        className={`text-md rounded-full bg-green-200 p-2 text-green-800 ring-1 ring-green-700 transition-all duration-500 hover:scale-105 hover:shadow-md ${
          prop.row.original.status === "approved" || prop.row.original.status === "rejected" ? "hidden" : ""
        }`}
      >
        <TeenyiconsShieldTickOutline />
      </button>

      <a
        href={`/api/visa-form/download-form-pdf-${SelectedCountry}/${prop.row.original.id}`}
        target="_blank"
        title="download"
        className="rounded-full bg-blue-200 p-1 text-xl text-blue-800 ring-1 ring-blue-700 transition-all duration-500 hover:scale-105 hover:shadow-md"
        rel="noreferrer"
      >
        <LineMdDownloadingLoop />
      </a>
    </div>
  );
};
// icons

export function LineMdDownloadingLoop(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2">
        <path
          strokeDasharray="2 4"
          strokeDashoffset="6"
          d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21"
        >
          <animate attributeName="stroke-dashoffset" dur="0.6s" repeatCount="indefinite" values="6;0"></animate>
        </path>
        <path strokeDasharray="30" strokeDashoffset="30" d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.1s" dur="0.3s" values="30;0"></animate>
        </path>
        <path strokeDasharray="10" strokeDashoffset="10" d="M12 8v7.5">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="10;0"></animate>
        </path>
        <path strokeDasharray="6" strokeDashoffset="6" d="M12 15.5l3.5 -3.5M12 15.5l-3.5 -3.5">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="6;0"></animate>
        </path>
      </g>
    </svg>
  );
}
export function LineMdDocumentList(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <g strokeWidth="2">
          <path strokeDasharray="64" strokeDashoffset="64" d="M13 3L19 9V21H5V3H13">
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"></animate>
          </path>
          <path strokeDasharray="6" strokeDashoffset="6" d="M9 13H13">
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="6;0"></animate>
          </path>
          <path strokeDasharray="8" strokeDashoffset="8" d="M9 16H15">
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="1.2s" dur="0.2s" values="8;0"></animate>
          </path>
        </g>
        <path strokeDasharray="14" strokeDashoffset="14" d="M12.5 3V8.5H19">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="14;0"></animate>
        </path>
      </g>
    </svg>
  );
}

export function EmojioneV1FlagForThailand(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 64 64" {...props}>
      <path fill="#2b3990" d="M0 22h64v20H0z"></path>
      <path
        fill="#ec1c24"
        d="M10 54h44c5.086 0 8.247-2.905 9.446-7H.554c1.199 4.095 4.36 7 9.446 7m44-44H10c-5.086 0-8.247 2.905-9.446 7h62.893c-1.2-4.095-4.361-7-9.447-7"
      ></path>
      <path
        fill="#e6e7e8"
        d="M64 42H0v1c0 1.413.19 2.759.554 4h62.893c.363-1.241.553-2.587.553-4v-1m0-21c0-1.413-.19-2.759-.554-4H.554A14.215 14.215 0 0 0 0 21v1h64v-1z"
      ></path>
    </svg>
  );
}

export function TwemojiFlagForFlagSingapore(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36" {...props}>
      <path fill="#EEE" d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v18z"></path>
      <path fill="#ED2939" d="M36 18V9a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v9h36z"></path>
      <path
        fill="#FFF"
        d="M6 11.5c0-2.585 1.624-4.748 3.81-5.336A5.498 5.498 0 0 0 8.5 6a5.5 5.5 0 1 0 0 11c.452 0 .889-.06 1.31-.164C7.624 16.248 6 14.085 6 11.5z"
      ></path>
      <path
        d="M12 7l.225.691h.726l-.588.427l.225.691L12 8.382l-.588.427l.225-.691l-.588-.427h.726zm-2 7l.225.691h.726l-.588.427l.225.691l-.588-.427l-.588.427l.225-.691l-.588-.427h.726zm4 0l.225.691h.726l-.588.427l.225.691l-.588-.427l-.588.427l.225-.691l-.588-.427h.726zm-5-4l.225.691h.726l-.588.427l.225.691L9 11.382l-.588.427l.225-.691l-.588-.427h.726zm6 0l.225.691h.726l-.588.427l.225.691l-.588-.427l-.588.427l.225-.691l-.588-.427h.726z"
        fill="#EEE"
      ></path>
    </svg>
  );
}

export function TwemojiFlagForFlagEuropeanUnion(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36" {...props}>
      <path fill="#039" d="M32 5H4a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4z"></path>
      <path
        d="M18.539 9.705l.849-.617h-1.049l-.325-.998l-.324.998h-1.049l.849.617l-.325.998l.849-.617l.849.617zm0 17.333l.849-.617h-1.049l-.325-.998l-.324.998h-1.049l.849.617l-.325.998l.849-.617l.849.617zm-8.666-8.667l.849-.617h-1.05l-.324-.998l-.325.998H7.974l.849.617l-.324.998l.849-.617l.849.617zm1.107-4.285l.849-.617h-1.05l-.324-.998l-.324.998h-1.05l.849.617l-.324.998l.849-.617l.849.617zm0 8.619l.849-.617h-1.05l-.324-.998l-.324.998h-1.05l.849.617l-.324.998l.849-.617l.849.617zm3.226-11.839l.849-.617h-1.05l-.324-.998l-.324.998h-1.05l.849.617l-.324.998l.849-.617l.849.617zm0 15.067l.849-.617h-1.05l-.324-.998l-.324.998h-1.05l.849.617l-.324.998l.849-.616l.849.616zm11.921-7.562l-.849-.617h1.05l.324-.998l.325.998h1.049l-.849.617l.324.998l-.849-.617l-.849.617zm-1.107-4.285l-.849-.617h1.05l.324-.998l.324.998h1.05l-.849.617l.324.998l-.849-.617l-.849.617zm0 8.619l-.849-.617h1.05l.324-.998l.324.998h1.05l-.849.617l.324.998l-.849-.617l-.849.617zm-3.226-11.839l-.849-.617h1.05l.324-.998l.324.998h1.05l-.849.617l.324.998l-.849-.617l-.849.617zm0 15.067l-.849-.617h1.05l.324-.998l.324.998h1.05l-.849.617l.324.998l-.849-.616l-.849.616z"
        fill="#FC0"
      ></path>
    </svg>
  );
}

export function LineMdCoffeeLoop(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path strokeDasharray="48" strokeDashoffset="48" d="M17 9v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9z">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="48;0"></animate>
        </path>
        <path
          strokeDasharray="14"
          strokeDashoffset="14"
          d="M17 14H20C20.55 14 21 13.55 21 13V10C21 9.45 20.55 9 20 9H17"
        >
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="14;28"></animate>
        </path>
      </g>
      <mask id="lineMdCoffeeLoop0">
        <path
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          d="M8 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M12 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M16 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4"
        >
          <animateMotion calcMode="linear" dur="3s" path="M0 0v-8" repeatCount="indefinite"></animateMotion>
        </path>
      </mask>
      <rect width="24" height="0" y="7" fill="currentColor" mask="url(#lineMdCoffeeLoop0)">
        <animate fill="freeze" attributeName="y" begin="0.8s" dur="0.6s" values="7;2"></animate>
        <animate fill="freeze" attributeName="height" begin="0.8s" dur="0.6s" values="0;5"></animate>
      </rect>
    </svg>
  );
}

export function OpenmojiWarning(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 72 72" {...props}>
      <g strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2">
        <path
          fill="#fcea2b"
          d="M32.522 13.005c.698-1.205 1.986-2.024 3.478-2.024c1.492 0 2.78.82 3.478 2.024L60.446 54.94A4 4 0 0 1 61 56.948a4.032 4.032 0 0 1-4.032 4.033l-41.936.017A4.033 4.033 0 0 1 11 56.966c0-.736.211-1.415.554-2.009l20.968-41.952"
        ></path>
        <path fill="#FFF" d="M37.613 47.27a1.613 1.613 0 0 1-3.226 0V23.893a1.613 1.613 0 0 1 3.226 0v23.379z"></path>
        <circle cx="36" cy="54.529" r="1.613" fill="#FFF"></circle>
      </g>
      <g fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2">
        <path d="M32.522 13.005c.698-1.205 1.986-2.024 3.478-2.024c1.492 0 2.78.82 3.478 2.024L60.446 54.94A4 4 0 0 1 61 56.948a4.032 4.032 0 0 1-4.032 4.033l-41.936.017A4.033 4.033 0 0 1 11 56.966c0-.736.211-1.415.554-2.009l20.968-41.952"></path>
        <path d="M37.613 47.27a1.613 1.613 0 0 1-3.226 0V23.893a1.613 1.613 0 0 1 3.226 0v23.379z"></path>
        <circle cx="36" cy="54.529" r="1.613"></circle>
      </g>
    </svg>
  );
}

export function SvgSpinnersPulseRings3(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
        transform="matrix(0 0 0 0 12 12)"
      >
        <animateTransform
          id="svgSpinnersPulseRings30"
          attributeName="transform"
          begin="0;svgSpinnersPulseRings32.begin+0.4s"
          calcMode="spline"
          dur="1.2s"
          keySplines=".52,.6,.25,.99"
          type="translate"
          values="12 12;0 0"
        ></animateTransform>
        <animateTransform
          additive="sum"
          attributeName="transform"
          begin="0;svgSpinnersPulseRings32.begin+0.4s"
          calcMode="spline"
          dur="1.2s"
          keySplines=".52,.6,.25,.99"
          type="scale"
          values="0;1"
        ></animateTransform>
        <animate
          attributeName="opacity"
          begin="0;svgSpinnersPulseRings32.begin+0.4s"
          calcMode="spline"
          dur="1.2s"
          keySplines=".52,.6,.25,.99"
          values="1;0"
        ></animate>
      </path>
      <path
        fill="currentColor"
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
        transform="matrix(0 0 0 0 12 12)"
      >
        <animateTransform
          id="svgSpinnersPulseRings31"
          attributeName="transform"
          begin="svgSpinnersPulseRings30.begin+0.4s"
          calcMode="spline"
          dur="1.2s"
          keySplines=".52,.6,.25,.99"
          type="translate"
          values="12 12;0 0"
        ></animateTransform>
        <animateTransform
          additive="sum"
          attributeName="transform"
          begin="svgSpinnersPulseRings30.begin+0.4s"
          calcMode="spline"
          dur="1.2s"
          keySplines=".52,.6,.25,.99"
          type="scale"
          values="0;1"
        ></animateTransform>
        <animate
          attributeName="opacity"
          begin="svgSpinnersPulseRings30.begin+0.4s"
          calcMode="spline"
          dur="1.2s"
          keySplines=".52,.6,.25,.99"
          values="1;0"
        ></animate>
      </path>
      <path
        fill="currentColor"
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
        transform="matrix(0 0 0 0 12 12)"
      >
        <animateTransform
          id="svgSpinnersPulseRings32"
          attributeName="transform"
          begin="svgSpinnersPulseRings30.begin+0.8s"
          calcMode="spline"
          dur="1.2s"
          keySplines=".52,.6,.25,.99"
          type="translate"
          values="12 12;0 0"
        ></animateTransform>
        <animateTransform
          additive="sum"
          attributeName="transform"
          begin="svgSpinnersPulseRings30.begin+0.8s"
          calcMode="spline"
          dur="1.2s"
          keySplines=".52,.6,.25,.99"
          type="scale"
          values="0;1"
        ></animateTransform>
        <animate
          attributeName="opacity"
          begin="svgSpinnersPulseRings30.begin+0.8s"
          calcMode="spline"
          dur="1.2s"
          keySplines=".52,.6,.25,.99"
          values="1;0"
        ></animate>
      </path>
    </svg>
  );
}

export function TeenyiconsShieldTickOutline(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        d="M4 7.5L7 10l4-5M7.5.5l-7 4v.72a9.651 9.651 0 0 0 7 9.28a9.651 9.651 0 0 0 7-9.28V4.5l-7-4Z"
      ></path>
    </svg>
  );
}

export function TdesignFileBlocked(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M3 1h12.414L21 6.586V11h-2V9h-6V3H5v18h6v2H3V1Zm12 2.414V7h3.586L15 3.414ZM18 14.5a3.5 3.5 0 0 0-3.08 5.165l4.745-4.744A3.483 3.483 0 0 0 18 14.5Zm3.08 1.835l-4.745 4.744a3.5 3.5 0 0 0 4.745-4.745ZM12.5 18a5.5 5.5 0 1 1 11 0a5.5 5.5 0 0 1-11 0Z"
      ></path>
    </svg>
  );
}

export function ClarityDetailsLine(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36" {...props}>
      <path
        fill="currentColor"
        d="M32 6H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Zm0 22H4V8h28Z"
        className="clr-i-outline clr-i-outline-path-1"
      ></path>
      <path
        fill="currentColor"
        d="M9 14h18a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2Z"
        className="clr-i-outline clr-i-outline-path-2"
      ></path>
      <path
        fill="currentColor"
        d="M9 18h18a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2Z"
        className="clr-i-outline clr-i-outline-path-3"
      ></path>
      <path
        fill="currentColor"
        d="M9 22h10a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2Z"
        className="clr-i-outline clr-i-outline-path-4"
      ></path>
      <path fill="none" d="M0 0h36v36H0z"></path>
    </svg>
  );
}

export function SolarPenNewRoundLineDuotone(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          d="M16.652 3.455s.081 1.379 1.298 2.595c1.216 1.217 2.595 1.298 2.595 1.298M10.1 15.588L8.413 13.9"
          opacity=".5"
        ></path>
        <path d="m16.652 3.455l.649-.649A2.753 2.753 0 0 1 21.194 6.7l-.65.649l-5.964 5.965c-.404.404-.606.606-.829.78a4.59 4.59 0 0 1-.848.524c-.255.121-.526.211-1.068.392l-1.735.579l-1.123.374a.742.742 0 0 1-.939-.94l.374-1.122l.579-1.735c.18-.542.27-.813.392-1.068c.144-.301.32-.586.524-.848c.174-.223.376-.425.78-.83l5.965-5.964Z"></path>
        <path strokeLinecap="round" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2" opacity=".5"></path>
      </g>
    </svg>
  );
}
