import { useState, useMemo, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import {
  Dropdown,
  Icon,
  Tooltip,
  TextField,
  TextArea,
  Button,
} from "monday-ui-react-core";
import { Info } from "monday-ui-react-core/icons";
import {
  CustomService,
  CustomAPIRequest,
  MondayService,
  User,
  PairValue,
} from "../api";
import { PairValueComponent } from "./PairValue";
import { handleSuccessClick } from "../Utils/monday";
import { FieldsRequiredModal } from "./Modals/FieldsRequiredModal";

const monday = mondaySdk();

interface Option {
  value: any;
  label: string;
}

export interface CustomApiFormProps {
  sessionToken?: string;
}

export const CustomApiForm: React.FC<CustomApiFormProps> = ({
  sessionToken,
}) => {
  const [method, setMethod] = useState<Option>({ value: "get", label: "GET" });
  const [url, setUrl] = useState<string>();
  const [authMethod, setAuthMethod] = useState<Option>({
    value: "none",
    label: "None",
  });
  const [authValue, setAuthValue] = useState<string>();
  const [body, setBody] = useState<string>();
  const [paramaters, setParameters] = useState<PairValue[]>([]);
  const [headers, setHeaders] = useState<PairValue[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [boardId, setBoardId] = useState<number>();
  const [subdomain, setSubdomain] = useState("");
  const [showModal, setShowModal] = useState(false);

  const methodOptions = useMemo(() => {
    return [
      { value: "get", label: "GET" },
      { value: "post", label: "POST" },
    ];
  }, []);

  const authOptions = useMemo(() => {
    return [
      { value: "none", label: "None" },
      { value: "token", label: "Bearer Token" },
    ];
  }, []);

  const handleRunClick = () => {
    if (url) {
      setLoading(true);
      const requestBody: CustomAPIRequest = {
        method: method.value,
        url: url,
        auth: authValue,
        body: body,
        params: paramaters,
        headers: headers,
      };

      CustomService.customApiRequest(requestBody)
        .then((json) => {
          CustomService.customFetchData(json)
            .then((data) => {
              if (sessionToken) {
                MondayService.mondayCreateBoardWithData(
                  "Custom Request",
                  sessionToken,
                  data
                )
                  .then((board_id) => {
                    setBoardId(board_id);
                    // Send valueCreatedForUser event when data has been loaded into board
                    monday.execute("valueCreatedForUser");
                    setLoading(false);
                    setSuccess(true);
                  })
                  .catch(() => {
                    setLoading(false);
                    setSuccess(false);
                  });
              }
            })
            .catch(() => {
              setLoading(false);
              setSuccess(false);
            });
        })
        .catch(() => {
          setLoading(false);
          setSuccess(false);
        });
    } else {
      setShowModal(true);
      setLoading(false);
      setSuccess(false);
    }
  };

  useEffect(() => {
    const getSubdomain = () => {
      monday
        .get("location")
        .then((res) => {
          if (res.data && res.data.href) {
            const url = new URL(res.data.href);
            const hostnameParts = url.hostname.split(".");

            if (hostnameParts.length > 2 && hostnameParts[0] !== "www") {
              setSubdomain(hostnameParts[0]);
            } else if (hostnameParts.length > 2) {
              setSubdomain(hostnameParts[1]);
            } else {
              console.error("Unable to determine subdomain");
            }
          } else {
            console.error("Invalid location data");
          }
        })
        .catch((error) => {
          console.error("Error getting location:", error);
        });
    };

    getSubdomain();
  }, []);

  return (
    <>
      <div className="mt-2">
        <div className="border-2 border-grey rounded-md p-5 mb-2">
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-500 text-sm">* Method & Url</p>
            <Tooltip
              content="Method for your API call and API url"
              position={Tooltip.positions.TOP}
            >
              <Icon icon={Info} className="text-gray-500" />
            </Tooltip>
          </div>
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="col-span-1 w-full">
              <Dropdown
                placeholder="Select Method"
                value={method}
                options={methodOptions}
                onOptionSelect={(e: Option) => setMethod(e)}
              />
            </div>
            <div className="col-span-7 -full">
              <TextField
                placeholder="Url"
                size={TextField.sizes.MEDIUM}
                onChange={(e: string) => setUrl(e)}
              />
            </div>
          </div>
        </div>
        <div className="border-2 border-grey rounded-md p-5 mb-2">
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-500 text-sm">
              Auhorization (optional){" "}
            </p>
            <Tooltip
              content="Auhtorization type"
              position={Tooltip.positions.TOP}
            >
              <Icon icon={Info} className="text-gray-500" />
            </Tooltip>
          </div>
          <Dropdown
            placeholder="Select Authorization type"
            className="mb-2"
            value={authMethod}
            options={authOptions}
            onOptionSelect={(e: Option) => setAuthMethod(e)}
          />
          {authMethod.value === "token" && (
            <TextField
              placeholder="Token"
              className="mb-2"
              size={TextField.sizes.MEDIUM}
              onChange={(e: string) => setAuthValue(e)}
            />
          )}
        </div>
        <div className="border-2 border-grey rounded-md p-5 mb-2">
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-500 text-sm">
              Headers (optional)
            </p>
            <Tooltip content="API Headers" position={Tooltip.positions.TOP}>
              <Icon icon={Info} className="text-gray-500" />
            </Tooltip>
          </div>
          <PairValueComponent pairs={headers} setPairs={setHeaders} />
        </div>
        <div className="border-2 border-grey rounded-md p-5 mb-2">
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-500 text-sm">
              Parameters (optional)
            </p>
            <Tooltip content="API Parameters" position={Tooltip.positions.TOP}>
              <Icon icon={Info} className="text-gray-500" />
            </Tooltip>
          </div>
          <PairValueComponent pairs={paramaters} setPairs={setParameters} />
        </div>
        {method.value === "post" && (
          <div className="border-2 border-grey rounded-md p-5 mb-2">
            <div className="flex items-center gap-1">
              <p className="font-bold text-gray-500 text-sm">Body (optional)</p>
              <Tooltip
                content="JSON Body for your API call"
                position={Tooltip.positions.TOP}
              >
                <Icon icon={Info} className="text-gray-500" />
              </Tooltip>
            </div>
            <TextArea
              placeholder="Body"
              className="mb-2"
              onChange={(e: any) => setBody(e.target.value)}
            />
          </div>
        )}
        {success && boardId ? (
          <Button
            onClick={() => handleSuccessClick(subdomain, boardId)}
            loading={loading}
            className="mt-2 bg-green-500"
          >
            Run Complete - Go to Board
          </Button>
        ) : (
          <Button
            onClick={handleRunClick}
            loading={loading}
            success={success}
            successText="Run Complete - Go to Board"
            className="mt-2"
          >
            Run
          </Button>
        )}
      </div>
      <FieldsRequiredModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};
