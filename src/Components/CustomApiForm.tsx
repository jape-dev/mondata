import { useState, useMemo } from "react";
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
import { PairValueComponent, PairValueProps } from "./PairValue";

const monday = mondaySdk();

interface Option {
  value: any;
  label: string;
}

export interface CustomApiFormProps {
  user: User;
}

export const CustomApiForm: React.FC<CustomApiFormProps> = ({ user }) => {
  const [method, setMethod] = useState<Option>({ value: "get", label: "GET" });
  const [url, setUrl] = useState<string>();
  const [authMethod, setAuthMethod] = useState<Option>({
    value: "none",
    label: "None",
  });
  const [authValue, setAuthValue] = useState<string>();
  const [body, setBody] = useState<string>();
  const [paramaters, setParameters] = useState<PairValue[]>([
    { key: "", value: "" },
  ]);
  const [headers, setHeaders] = useState<PairValue[]>([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
      console.log(requestBody);

      CustomService.customApiRequest(requestBody)
        .then((json) => {
          CustomService.customFetchData(json)
            .then((data) => {
              if (user.monday_token) {
                MondayService.mondayCreateBoardWithData(
                  user?.monday_token,
                  "Custom Request",
                  data
                )
                  .then(() => {
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
    }
  };

  return (
    <>
      <div className="mt-2">
        <div className="border-2 border-grey rounded-md p-5 mb-2">
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-500 text-sm">* Method</p>
            <Tooltip
              content="Method for your API call"
              position={Tooltip.positions.TOP}
            >
              <Icon icon={Info} className="text-gray-500" />
            </Tooltip>
          </div>
          <Dropdown
            placeholder="Select Method"
            className="mb-2"
            value={method}
            options={methodOptions}
            onOptionSelect={(e: Option) => setMethod(e)}
          />
          <TextField
            placeholder="url"
            className="mb-2"
            onChange={(e) => setUrl(e)}
          />
        </div>
        <div className="border-2 border-grey rounded-md p-5 mb-2">
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-500 text-sm">Auhorization</p>
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
              onChange={(e) => setAuthValue(e)}
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
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <Button
          onClick={handleRunClick}
          loading={loading}
          success={success}
          successText="Run Complete - Go to Board"
          className="mt-2"
        >
          Run
        </Button>
      </div>
    </>
  );
};
