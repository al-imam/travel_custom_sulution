import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import exportFromJSON from "export-from-json";
// import Table from "../../public/Entry/ComplexTable";
import Table from "../../admin/agent/table";
function TotalInfo() {
  const [loiData, setLoiData] = useState([]);
  const [openGuest, setOpenGuest] = useState(false);
  const [heading, setHeading] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/agent/agent-loi-by-id");
        setLoiData(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/admin/heading");
        setHeading(data.text);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  let ExportToExcel = () => {
    const dats = loiData.map((e) => {
      return {
        id: e.id,
        Issue_Date: new Date(e.updateAt).toGMTString(),
        Guest_Name: e.guest_name,
        Pasport_Number: e.pasport_number,
        Travel_Date: e.travel_date?.split("-").reverse().join("-"),
        Agent: `${JSON.parse(e.agent).username} ${JSON.parse(e.agent).type === "admin" ? "Admin" : ""}`,
        Status: e.status,
        Purpose: e.purpose,
        Hotel_Name: e.hotel_name,
        Refarenc: e.reference,
      };
    });
    exportFromJSON({
      data: dats,
      fileName: "Data",
      exportType: exportFromJSON.types.xls,
    });
  };

  return (
    <div>
      {typeof openGuest === "object" && (
        <div className="fixed left-0 top-0 z-10 h-screen  w-full overflow-auto bg-white/60 pt-48 backdrop-blur-md">
          <div className="mx-2 w-full rounded-md bg-brand-100 p-3 pb-20 shadow-md md:mx-auto md:w-11/12">
            <div className="relative flex w-full items-center justify-between border-b-2 border-brand-600 p-3 text-xl font-bold text-white">
              <div className="flex items-center">
                <span className="pr-2 text-2xl text-brand-700">
                  <PhUserBold />
                </span>{" "}
                Guest Details
              </div>
              <div>
                <button
                  onClick={() => setOpenGuest(false)}
                  className="rounded-md border-2 border-red-500 px-4 py-2 text-red-500 transition-all duration-500 hover:bg-red-500 hover:text-white"
                >
                  close
                </button>
              </div>
            </div>
            <div className="grid w-full grid-cols-2">
              <div className="relative col-span-2 w-full md:col-span-1">
                <div className="px-2 pt-2 text-xl font-bold">
                  <span>Name</span>: <span>{openGuest.guest_name}</span>
                </div>
                <div className="px-2 text-lg font-light">
                  <span>Email</span>: <span>{JSON.parse(openGuest.agent).username}</span>
                </div>
                <div className="px-2 text-lg font-light">
                  <span>Passport No</span>: <span>{openGuest.pasport_number}</span>
                </div>
                <div className="px-2 text-lg font-light">
                  <span>Country</span>: <span>{openGuest.country}</span>
                </div>
                <div className="px-2 text-lg font-light">
                  <span>Travel Date</span>: <span>{openGuest.travel_date}</span>
                </div>
                <div className="px-2 text-lg font-light">
                  <span>Status</span>: <span>{openGuest.status}</span>
                </div>
                <div className="px-2 text-lg font-light">
                  <span>Submitted On</span>:{" "}
                  <span>{new Date(openGuest.createdAt).toLocaleString().replaceAll("/", "-")}</span>
                </div>
              </div>
              <div className="relative w-full ">
                {openGuest.visa_application ? (
                  <a
                    href={`/api/visa-form/download-form-pdf-${openGuest.country}/${openGuest.visa_application}`}
                    target="_blank"
                    className="float-right mt-2 flex items-center rounded-xl bg-brand-600 px-5 py-3 font-bold text-white transition-all  duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                    rel="noreferrer"
                  >
                    <span className="pr-2 text-2xl">
                      <LineMdDownloadOutlineLoop />
                    </span>
                    Download Visa Application Form
                  </a>
                ) : (
                  <Link
                    to={`/entry/${openGuest.country.toLowerCase()}?ref=${openGuest.id}`}
                    className="float-right mt-2 flex items-center rounded-xl bg-brand-600 px-5 py-3 font-bold text-white transition-all  duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                  >
                    <span className="pr-2 text-2xl">
                      <LucideFileEdit />
                    </span>
                    Fill Visa Application Form
                  </Link>
                )}
                <a
                  href={`/download/family/undertaking/${openGuest.id}`}
                  target="_blank"
                  className="float-right mx-2 mt-2 flex items-center rounded-xl bg-brand-600 px-5 py-3 font-bold text-white transition-all  duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                  rel="noreferrer"
                >
                  <span className="pr-2 text-2xl">
                    <LineMdDownloadOutlineLoop />
                  </span>
                  Download Undertaking
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {heading !== "" && (
        <div className="full-width-div my-4 flex justify-center overflow-hidden bg-white bg-clip-border py-4 text-2xl shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <marquee direction="left" behavior="scroll" scrollamount="5">
            {heading}
          </marquee>
        </div>
      )}

      {/*       <div className="mt-14 flex flex-wrap gap-5">
        <div className="!z-5 relative flex flex-grow items-center rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full  bg-[#F4F7FE] text-brand-500 shadow-sm dark:text-white">
              <HeroiconsOutlineArrowCircleRight />
            </div>
          </div>
          <div className="h-50 ml-4 flex w-auto flex-col justify-center">
            <p className="font-dm text-sm font-medium text-gray-600">Total Submit</p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">400</h4>
          </div>
        </div>
        <div className="!z-5 relative flex flex-grow items-center rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full  bg-[#F4F7FE] text-brand-500 shadow-sm dark:text-white">
              <HeroiconsOutlineChartPie />
            </div>
          </div>
          <div className="h-50 ml-4 flex w-auto flex-col justify-center">
            <p className="font-dm text-sm font-medium text-gray-600">Total pandding</p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">300</h4>
          </div>
        </div>
        <div className="!z-5 relative flex flex-grow items-center rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full  bg-[#F4F7FE] text-brand-500 shadow-sm dark:text-white">
              <SubwayTick />
            </div>
          </div>
          <div className="h-50 ml-4 flex w-auto flex-col justify-center">
            <p className="font-dm text-sm font-medium text-gray-600">Total Confrom</p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">1200</h4>
          </div>
        </div>
        <div className="!z-5 relative flex flex-grow items-center rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full  bg-[#F4F7FE] text-brand-500 shadow-sm dark:text-white">
              <SubwayCrpss />
            </div>
          </div>
          <div className="h-50 ml-4 flex w-auto flex-col justify-center">
            <p className="font-dm text-sm font-medium text-gray-600">Total Cencle</p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">200</h4>
          </div>
        </div>
      </div> */}
      <div className="mt-4 flex flex-wrap justify-between gap-4">
        <Link
          className="inline-block rounded-lg border-2 border-brand-900/30 bg-white/10  p-3 text-xl font-bold text-brand-600 shadow-xl hover:scale-105 dark:border-brand-200 dark:text-brand-100"
          to="/entry"
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v6.7q-.475-.225-.975-.388T19 11.075V5H5v14h6.05q.075.55.238 1.05t.387.95H5Zm0-3v1V5v6.075V11v7Zm2-1h4.075q.075-.525.238-1.025t.362-.975H7v2Zm0-4h6.1q.8-.75 1.788-1.25T17 11.075V11H7v2Zm0-4h10V7H7v2Zm11 14q-2.075 0-3.538-1.463T13 18q0-2.075 1.463-3.538T18 13q2.075 0 3.538 1.463T23 18q0 2.075-1.463 3.538T18 23Zm-.5-2h1v-2.5H21v-1h-2.5V15h-1v2.5H15v1h2.5V21Z"
              ></path>
            </svg>
            LOI Request
          </span>
        </Link>
        <button
          type="button"
          className=" rounded-md bg-green-500 px-4 py-2 font-bold text-white shadow-md"
          onClick={ExportToExcel}
        >
          Export To Excel
        </button>
      </div>

      <div className="mt-5">
        {/* <Table
          columnsData={}
          tableData={loiData}
        /> */}

        <Table
          colunm={[
            {
              Header: "Guest Name",
              accessor: "guest_name",
              Cell: (prop) => {
                return (
                  <div>
                    <p>{prop.row.original?.guest_name}</p>
                    <p>{prop.row.original?.pasport_number}</p>
                  </div>
                );
              },
            },
            {
              Header: "Travel Date",
              accessor: "pasport_number",
              Cell: (prop) => {
                return (
                  <p>
                    {new Date(prop.row.original?.travel_date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      weekday: "long",
                    })}
                  </p>
                );
              },
            },
            {
              Header: "Country Name",
              accessor: "country",
              Cell: (prop) => {
                return <p>{prop.row.original?.country}</p>;
              },
            },
            {
              Header: "File",
              accessor: "passportPhoto",
              Cell: (prop) => {
                return (
                  <div>
                    <div className="flex items-center gap-2">
                      <span>
                        {prop.row.original?.pasport_copy === "" ? (
                          <button
                            title="visa copy available"
                            className="cursor-cell rounded-full border-[1px] border-brand-600/10  bg-red-50 p-1 text-sm  text-red-600"
                          >
                            {" "}
                            <IcTwotoneClose />{" "}
                          </button>
                        ) : (
                          <button
                            title="visa copy not available"
                            className="cursor-cell rounded-full border-[1px] border-brand-600/10  bg-green-50 p-1 text-sm text-green-600"
                          >
                            {" "}
                            <MaterialSymbolsDone />{" "}
                          </button>
                        )}
                      </span>
                      <p>password copy</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>
                        {prop.row.original?.tiket_copy === "" ? (
                          <button
                            title="visa copy available"
                            className="cursor-cell rounded-full border-[1px] border-brand-600/10  bg-red-50 p-1 text-sm  text-red-600"
                          >
                            {" "}
                            <IcTwotoneClose />{" "}
                          </button>
                        ) : (
                          <button
                            title="visa copy not available"
                            className="cursor-cell rounded-full border-[1px] border-brand-600/10  bg-green-50 p-1 text-sm text-green-600"
                          >
                            {" "}
                            <MaterialSymbolsDone />{" "}
                          </button>
                        )}
                      </span>
                      <p>ticket copy</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>
                        {prop.row.original?.visa_copy ? (
                          <button
                            title="visa copy available"
                            className="cursor-cell rounded-full border-[1px] border-brand-600/10 bg-green-50 p-1 text-sm text-green-600"
                          >
                            {" "}
                            <MaterialSymbolsDone />{" "}
                          </button>
                        ) : (
                          <button
                            title="visa copy not available"
                            className="cursor-cell rounded-full border-[1px] border-brand-600/10 bg-red-50 p-1 text-sm text-red-600"
                          >
                            {" "}
                            <IcTwotoneClose />{" "}
                          </button>
                        )}
                      </span>
                      <p>visa copy</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>
                        {prop.row.original?.hotel_copy ? (
                          <button
                            title="visa copy available"
                            className="cursor-cell rounded-full border-[1px] border-brand-600/10 bg-green-50 p-1 text-sm text-green-600"
                          >
                            {" "}
                            <MaterialSymbolsDone />{" "}
                          </button>
                        ) : (
                          <button
                            title="visa copy not available"
                            className="cursor-cell rounded-full border-[1px] border-brand-600/10 bg-red-50 p-1 text-sm text-red-600"
                          >
                            {" "}
                            <IcTwotoneClose />{" "}
                          </button>
                        )}
                      </span>
                      <p>hotel copy</p>
                    </div>
                  </div>
                );
              },
            },
            // {
            //   Header: "Agent email",
            //   accessor: "AgentDate",
            //   Cell: (prop) => {
            //     return <p>{prop.row.original?.agent ? JSON.parse(prop.row.original?.agent)?.username : ""}</p>;
            //   },
            // },
            {
              Header: "Status",
              accessor: "status",
            },
            {
              Header: "Action",
              accessor: "action",
              Cell: (prop) => {
                return (
                  <div className="relative flex items-center justify-end">
                    {prop.row.original.status === "approved" && (
                      <button
                        onClick={() => {
                          setTimeout(() => {
                            window.open(`/download/itinerary/${prop.row.original.reference}`, "_blank");
                          }, 100);
                          window.open(`/download/loi/${prop.row.original.id}`, "_blank");
                        }}
                        title="download loi and itinerary "
                        className="flex h-full items-center pr-3 text-3xl hover:text-brand-400 md:text-5xl "
                      >
                        <LineMdDownloadingLoop />
                      </button>
                    )}

                    <button
                      title="details"
                      onClick={() => {
                        setOpenGuest(prop.row.original);
                      }}
                      className="rounded bg-brand-500 px-6 py-2 text-base font-medium text-white transition duration-200
                      hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300
                      dark:active:bg-brand-200"
                    >
                      {" "}
                      Details
                    </button>
                  </div>
                );
              },
            },
          ]}
          datas={loiData}
        />
      </div>
    </div>
  );
}

export default TotalInfo;

export function SubwayCrpss(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512" {...props}>
      <path
        fill="currentColor"
        d="M512 76.8L435.2 0L256 179.2L76.8 0L0 76.8L179.2 256L0 435.2L76.8 512L256 332.8L435.2 512l76.8-76.8L332.8 256z"
      ></path>
    </svg>
  );
}

export function SubwayTick(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 512 512" {...props}>
      <path fill="currentColor" d="M437.3 30L202.7 339.3L64 200.7l-64 64L213.3 478L512 94z"></path>
    </svg>
  );
}

export function HeroiconsOutlineArrowCircleRight(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"
      ></path>
    </svg>
  );
}

export function HeroiconsOutlineChartPie(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="M11 3.055A9.001 9.001 0 1 0 20.945 13H11V3.055Z"></path>
        <path d="M20.488 9H15V3.512A9.025 9.025 0 0 1 20.488 9Z"></path>
      </g>
    </svg>
  );
}

export function MaterialSymbolsAddNotesOutline(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v6.7q-.475-.225-.975-.388T19 11.075V5H5v14h6.05q.075.55.238 1.05t.387.95H5Zm0-3v1V5v6.075V11v7Zm2-1h4.075q.075-.525.238-1.025t.362-.975H7v2Zm0-4h6.1q.8-.75 1.788-1.25T17 11.075V11H7v2Zm0-4h10V7H7v2Zm11 14q-2.075 0-3.538-1.463T13 18q0-2.075 1.463-3.538T18 13q2.075 0 3.538 1.463T23 18q0 2.075-1.463 3.538T18 23Zm-.5-2h1v-2.5H21v-1h-2.5V15h-1v2.5H15v1h2.5V21Z"
      ></path>
    </svg>
  );
}

export function MaterialSymbolsDeleteOutline(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M7 21q-.825 0-1.413-.588T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.588 1.413T17 21H7ZM17 6H7v13h10V6ZM9 17h2V8H9v9Zm4 0h2V8h-2v9ZM7 6v13V6Z"
      ></path>
    </svg>
  );
}

export function MaterialSymbolsDone(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4L9.55 18Z"></path>
    </svg>
  );
}

export function IcTwotoneClose(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
      ></path>
    </svg>
  );
}

export function MaterialSymbolsAirplaneTicketOutlineRounded(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="m11.8 12.9l-2.4.6l-1.075-.8q-.075-.05-.4-.1l-.125.05q-.225.05-.325.263t.025.412l1.15 2q.1.15.25.213t.325.012l8.525-2.25q.375-.1.563-.463t.087-.737q-.1-.375-.437-.562t-.713-.088l-2.45.65l-3.725-3.5q-.125-.125-.3-.162t-.35.012l-.125.025q-.35.075-.488.4t.038.625l1.95 3.4ZM4 20q-.825 0-1.413-.588T2 18v-3.375q0-.275.175-.475t.45-.25q.6-.2.988-.725T4 12q0-.65-.388-1.175t-.987-.725q-.275-.05-.45-.25T2 9.375V6q0-.825.588-1.413T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.588 1.413T20 20H4Zm0-2h16V6H4v2.55q.925.55 1.463 1.463T6 12q0 1.075-.537 1.988T4 15.45V18Zm8-6Z"
      ></path>
    </svg>
  );
}

export function MaterialSymbolsArrowLeftAltRounded(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="m7.85 13l2.85 2.85q.3.3.288.7t-.288.7q-.3.3-.712.313t-.713-.288L4.7 12.7q-.3-.3-.3-.7t.3-.7l4.575-4.575q.3-.3.713-.287t.712.312q.275.3.288.7t-.288.7L7.85 11H19q.425 0 .713.288T20 12q0 .425-.288.713T19 13H7.85Z"
      ></path>
    </svg>
  );
}

export function PhUserBold(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M234.38 210a123.36 123.36 0 0 0-60.78-53.23a76 76 0 1 0-91.2 0A123.36 123.36 0 0 0 21.62 210a12 12 0 1 0 20.77 12c18.12-31.32 50.12-50 85.61-50s67.49 18.69 85.61 50a12 12 0 0 0 20.77-12ZM76 96a52 52 0 1 1 52 52a52.06 52.06 0 0 1-52-52Z"
      ></path>
    </svg>
  );
}

export function PhThumbsUp(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M234 80.12A24 24 0 0 0 216 72h-56V56a40 40 0 0 0-40-40a8 8 0 0 0-7.16 4.42L75.06 96H32a16 16 0 0 0-16 16v88a16 16 0 0 0 16 16h172a24 24 0 0 0 23.82-21l12-96A24 24 0 0 0 234 80.12ZM32 112h40v88H32Zm191.94-15l-12 96a8 8 0 0 1-7.94 7H88v-94.11l36.71-73.43A24 24 0 0 1 144 56v24a8 8 0 0 0 8 8h64a8 8 0 0 1 7.94 9Z"
      ></path>
    </svg>
  );
}

export function PhMoneyBold(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M240 52H16A12 12 0 0 0 4 64v128a12 12 0 0 0 12 12h224a12 12 0 0 0 12-12V64a12 12 0 0 0-12-12Zm-58.79 128H74.79A60.18 60.18 0 0 0 28 133.21v-10.42A60.18 60.18 0 0 0 74.79 76h106.42A60.18 60.18 0 0 0 228 122.79v10.42A60.18 60.18 0 0 0 181.21 180ZM228 97.94A36.23 36.23 0 0 1 206.06 76H228ZM49.94 76A36.23 36.23 0 0 1 28 97.94V76ZM28 158.06A36.23 36.23 0 0 1 49.94 180H28ZM206.06 180A36.23 36.23 0 0 1 228 158.06V180ZM128 88a40 40 0 1 0 40 40a40 40 0 0 0-40-40Zm0 56a16 16 0 1 1 16-16a16 16 0 0 1-16 16Z"
      ></path>
    </svg>
  );
}

export function BytesizeSettings(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="M13 2v4l-2 1l-3-3l-4 4l3 3l-1 2H2v6h4l1 2l-3 3l4 4l3-3l2 1v4h6v-4l2-1l3 3l4-4l-3-3l1-2h4v-6h-4l-1-2l3-3l-4-4l-3 3l-2-1V2Z"></path>
        <circle cx="16" cy="16" r="4"></circle>
      </g>
    </svg>
  );
}

export function LineMdDownloadOutlineLoop(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path strokeDasharray="14" strokeDashoffset="14" d="M6 19h12">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.4s" values="14;0"></animate>
        </path>
        <path strokeDasharray="18" strokeDashoffset="18" d="M12 4 h2 v6 h2.5 L12 14.5M12 4 h-2 v6 h-2.5 L12 14.5">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="18;0"></animate>
          <animate
            attributeName="d"
            calcMode="linear"
            dur="1.5s"
            keyTimes="0;0.7;1"
            repeatCount="indefinite"
            values="M12 4 h2 v6 h2.5 L12 14.5M12 4 h-2 v6 h-2.5 L12 14.5;M12 4 h2 v3 h2.5 L12 11.5M12 4 h-2 v3 h-2.5 L12 11.5;M12 4 h2 v6 h2.5 L12 14.5M12 4 h-2 v6 h-2.5 L12 14.5"
          ></animate>
        </path>
      </g>
    </svg>
  );
}

export function LucideFileEdit(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5"></path>
        <path d="M14 2v6h6m-9.58 4.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21L4 22l.99-3.95l5.43-5.44Z"></path>
      </g>
    </svg>
  );
}

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
