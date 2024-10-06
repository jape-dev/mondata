import { useState, useMemo, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import {
  Dropdown,
  Button,
  TextField,
  Tooltip,
  Icon,
} from "monday-ui-react-core";
import { Info } from "monday-ui-react-core/icons";
import Nango from "@nangohq/frontend";
import {
  FacebookService,
  GoogleService,
  HTTPAuthorizationCredentials,
  UserPublic,
  UsersService,
  ShopifyService,
  Contact,
} from "../api";
import { FacebookAdsForm } from "../Components/FacebookAdsForm";
import { FacebookPagesForm } from "../Components/FacebookPagesForm";
import { InstagramPostsForm } from "../Components/InstagramPostsForm";
import { GoogleAdsForm } from "../Components/GoogleAdsForm";
import { GoogleAnalyticsForm } from "../Components/GoogleAnalyticsForm";
import { GoogleSheetsForm } from "../Components/GoogleSheetsForm";
import { CustomApiForm } from "Components/CustomApiForm";
import { ShopifyForm } from "../Components/ShopifyForm";
import { SchedulerBlock } from "../Components/SchedulerBlock";
import { RunBlock } from "Components/RunBlock";
import { Option } from "../Utils/models";
import { getNextScheduledDate } from "../Utils/datetime";
import { getConnectorName } from "../Utils/connector";

const monday = mondaySdk();

export const Connector: React.FC<{
  sessionToken: string | undefined;
  user: UserPublic | undefined;
}> = ({ sessionToken, user }) => {
  const [connector, setConnector] = useState<string>();
  const [connected, setConnected] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<number>();
  const [isViewer, setIsViewer] = useState(false);
  const [connectTrigger, setConnectTrigger] = useState(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [boardId, setBoardId] = useState<number>(999);
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [period, setPeriod] = useState<Option>({
    value: "hours",
    label: "Hourly",
  });
  const [step, setStep] = useState<Option>({
    value: 1,
    label: "1",
  });
  const [days, setDays] = useState<string[]>([
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
    "Sa",
    "Su",
  ]);
  const [startTime, setStartTime] = useState<string>(
    getNextScheduledDate([], "09:00")
  );
  const [timezone, setTimezone] = useState<Option>({
    value: 0,
    label: "(UTC+00:00) Western Europe Time, London, Lisbon, Casablanca",
  });
  const [shopifyStoreUrl, setShopifyStoreUrl] = useState<string>();

  useEffect(() => {
    const storedConnector = localStorage.getItem("selectedConnector");
    if (storedConnector) {
      setConnector(storedConnector);
    }
  }, []);

  // Save connector to localStorage whenever it changes
  useEffect(() => {
    if (connector) {
      localStorage.setItem("selectedConnector", connector);
    }
  }, [connector]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!connected) {
        // Your function to be called periodically
        setConnectTrigger((connectTrigger) => connectTrigger + 1);
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [connected]);

  useEffect(() => {
    monday
      .get("context")
      .then((res: any) => {
        if (res.data?.user) {
          const isViewOnly = res.data.user.isViewOnly;
          if (isViewOnly === true) {
            setIsViewer(true);
          }
        }
      })
      .catch((error: any) => {
        console.error("Error fetching context", error);
      });
  }, []);

  const getIconUrl = (imgPath: string) => {
    return require(`../Static/images/${imgPath}.png`);
  };

  const handleConnectorSelect = (connector: string) => {
    if (connector === "request_new") {
      const url = "https://data-importer.canny.io/feature-requests";
      window.open(url, "_blank");
    } else {
      setConnector(connector);
    }
  };

  const [options, setOptions] = useState([
    {
      value: "custom_api",
      label: "Custom API",
      leftAvatar: getIconUrl("custom-api-icon"),
    },
    {
      value: "facebook",
      label: "Facebook Ads",
      leftAvatar: getIconUrl("facebook-icon"),
    },
    {
      value: "facebook_pages",
      label: "Facebook Posts ",
      leftAvatar: getIconUrl("facebook-icon"),
    },
    {
      value: "instagram",
      label: "Instagram Posts",
      leftAvatar: getIconUrl("instagram-icon"),
    },
    {
      value: "google_ads",
      label: "Google Ads",
      leftAvatar: getIconUrl("google-ads-icon"),
    },
    {
      value: "google_analytics",
      label: "Google Analytics",
      leftAvatar: getIconUrl("google-analytics-icon"),
    },
    {
      value: "google_sheets",
      label: "Google Sheets",
      leftAvatar: getIconUrl("google-sheets-icon"),
    },
    {
      value: "request_new",
      label: "Request New Application",
    },
  ]);

  useEffect(() => {
    if (user?.monday_account_id === 25104519) {
      setOptions((prevOptions) => {
        if (!prevOptions.some((option) => option.value === "shopify")) {
          return [
            ...prevOptions,
            {
              value: "shopify",
              label: "Shopify",
              leftAvatar: getIconUrl("shopify-icon"),
            },
          ];
        }
        return prevOptions;
      });
    }
  }, [user]);

  async function updateUser(connectionId: string) {
    if (!sessionToken) {
      return;
    }

    const requestBody: HTTPAuthorizationCredentials = {
      scheme: "Bearer",
      credentials: sessionToken,
    };

    if (
      connector === "facebook" ||
      connector === "facebook_pages" ||
      connector === "instagram"
    ) {
      FacebookService.facebookLogin(connectionId, requestBody);
      // Need to make these set connected to true
    } else if (connector === "google_ads" || connector === "google_analytics") {
      GoogleService.googleLogin(connectionId, requestBody);
    } else if (connector === "google_sheets") {
      GoogleService.googleGoogleSheetsLogin(connectionId, requestBody);
    } else if (connector === "shopify") {
      ShopifyService.shopifyLogin(connectionId, requestBody);
    }
  }

  const nango = new Nango({
    publicKey:
      process.env.REACT_APP_NANGO_KEY || "7b73b776-3a10-41c0-a5ee-feef16d372d4",
  });

  const connect = () => {
    if (connector === undefined) {
      return;
    }

    if (user?.monday_user_id) {
      const contact: Contact = {
        email: "placeholder@gmail.com",
        first_connector: getConnectorName(connector),
      };
      UsersService.usersFirstConnector(user?.monday_user_id, contact);
    }

    if (
      connector === "facebook" ||
      connector === "facebook_pages" ||
      connector === "instagram"
    ) {
      nango
        .auth("facebook", "facebook-prod", {
          authorization_params: { config_id: "728465868571401" },
        })
        .then((result) => {
          updateUser(result.connectionId);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (connector === "google_ads" || connector === "google_analytics") {
      nango
        .auth("google", "google-prod")
        .then((result) => {
          updateUser(result.connectionId);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (connector === "google_sheets") {
      nango
        .auth("google-sheet", "google-sheets-prod")
        .then((result) => {
          updateUser(result.connectionId);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (connector === "shopify") {
      const storeUrl = shopifyStoreUrl
        ? shopifyStoreUrl
        : user?.shopify_store_url;

      if (!storeUrl) {
        alert("Please enter your Shopify store URL");
        return;
      }

      const subdomain = storeUrl.replace(/^https?:\/\//, "").split(".")[0];
      nango
        .auth("shopify", "shopify-prod", {
          params: { subdomain: subdomain },
        })
        .then((result) => {
          updateUser(result.connectionId);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (user && connector) {
      UsersService.usersConnected(user?.monday_user_id, connector).then(
        (res: boolean) => {
          setConnected(res);
        }
      );
    }
  }, [connector, user, connectTrigger]);

  useEffect(() => {
    monday.get("context").then((res: any) => {
      if (res.data.workspaceId) {
        setWorkspaceId(res.data.workspaceId);
      }
    });
  }, []);

  return (
    <>
      <div className="p-2">
        <div className="border-2 border-gray rounded-md p-5 mb-2">
          {isViewer ? (
            <div>
              <h1 className="font-bold">Viewer Access</h1>
              <p>
                This application can be used by users who have member, admin or
                guest access. As a viewer, you are unable to use this app.
                Please contact your admin to request a different role.
              </p>
            </div>
          ) : (
            <>
              <p className="font-bold text-gray-500 text-sm">* Application</p>
              <Dropdown
                placeholder="Select an application"
                options={options}
                onOptionSelect={(e: Option) => handleConnectorSelect(e.value)}
              />
              {connected === true && connector !== "custom_api" ? (
                <Button
                  kind={Button.kinds.TERTIARY}
                  className="text-xs text-gray-500 font-bold underline m-0 p-0 h-0"
                  onClick={() => connect()}
                >
                  Connect to different account?
                </Button>
              ) : connector === "shopify" ? (
                <>
                  <div className="flex items-center gap-1 mt-2">
                    <p className="font-bold text-gray-500 text-sm">
                      * Your Shopify store URL
                    </p>
                    <Tooltip
                      content="Must be in the format https://yourstore.myshopify.com"
                      position={Tooltip.positions.TOP}
                    >
                      <Icon icon={Info} className="text-gray-500" />
                    </Tooltip>
                  </div>
                  <TextField
                    placeholder="https://yourstore.myshopify.com"
                    value={shopifyStoreUrl}
                    onChange={(value: string) => setShopifyStoreUrl(value)}
                    className="mb-5"
                    size={TextField.sizes.MEDIUM}
                  />
                  <Button onClick={() => connect()} className="mt-5">
                    Connect
                  </Button>
                </>
              ) : connector !== "custom_api" ? (
                <Button onClick={() => connect()} className="mt-2">
                  Connect
                </Button>
              ) : null}
            </>
          )}
        </div>
        <div>
          {connected === true && user && workspaceId && connector && (
            <>
              {connector === "facebook" ? (
                <FacebookAdsForm
                  user={user}
                  sessionToken={sessionToken}
                  workspaceId={workspaceId}
                  isScheduled={isScheduled}
                  isRunning={isRunning}
                  setIsRunning={setIsRunning}
                  setLoading={setLoading}
                  setSuccess={setSuccess}
                  boardId={boardId}
                  setBoardId={setBoardId}
                  period={period}
                  step={step}
                  days={days}
                  startTime={startTime}
                  timezone={timezone}
                />
              ) : connector === "facebook_pages" ? (
                <FacebookPagesForm
                  user={user}
                  sessionToken={sessionToken}
                  workspaceId={workspaceId}
                  isScheduled={isScheduled}
                  isRunning={isRunning}
                  setIsRunning={setIsRunning}
                  setLoading={setLoading}
                  setSuccess={setSuccess}
                  boardId={boardId}
                  setBoardId={setBoardId}
                  period={period}
                  step={step}
                  days={days}
                  startTime={startTime}
                  timezone={timezone}
                />
              ) : connector === "instagram" ? (
                <InstagramPostsForm
                  user={user}
                  sessionToken={sessionToken}
                  workspaceId={workspaceId}
                  isScheduled={isScheduled}
                  isRunning={isRunning}
                  setIsRunning={setIsRunning}
                  setLoading={setLoading}
                  setSuccess={setSuccess}
                  boardId={boardId}
                  setBoardId={setBoardId}
                  period={period}
                  step={step}
                  days={days}
                  startTime={startTime}
                  timezone={timezone}
                />
              ) : connector === "google_ads" ? (
                <GoogleAdsForm
                  user={user}
                  sessionToken={sessionToken}
                  workspaceId={workspaceId}
                  isScheduled={isScheduled}
                  isRunning={isRunning}
                  setIsRunning={setIsRunning}
                  setLoading={setLoading}
                  setSuccess={setSuccess}
                  boardId={boardId}
                  setBoardId={setBoardId}
                  period={period}
                  step={step}
                  days={days}
                  startTime={startTime}
                  timezone={timezone}
                />
              ) : connector === "custom_api" ? (
                <CustomApiForm
                  sessionToken={sessionToken}
                  workspaceId={workspaceId}
                  user={user}
                  isScheduled={isScheduled}
                  isRunning={isRunning}
                  setIsRunning={setIsRunning}
                  setLoading={setLoading}
                  setSuccess={setSuccess}
                  boardId={boardId}
                  setBoardId={setBoardId}
                  period={period}
                  step={step}
                  days={days}
                  startTime={startTime}
                  timezone={timezone}
                />
              ) : connector === "google_sheets" ? (
                <GoogleSheetsForm
                  user={user}
                  sessionToken={sessionToken}
                  workspaceId={workspaceId}
                  isScheduled={isScheduled}
                  isRunning={isRunning}
                  setIsRunning={setIsRunning}
                  setLoading={setLoading}
                  setSuccess={setSuccess}
                  boardId={boardId}
                  setBoardId={setBoardId}
                  period={period}
                  step={step}
                  days={days}
                  startTime={startTime}
                  timezone={timezone}
                />
              ) : connector === "google_analytics" ? (
                <GoogleAnalyticsForm
                  user={user}
                  sessionToken={sessionToken}
                  workspaceId={workspaceId}
                  isScheduled={isScheduled}
                  isRunning={isRunning}
                  setIsRunning={setIsRunning}
                  setLoading={setLoading}
                  setSuccess={setSuccess}
                  boardId={boardId}
                  setBoardId={setBoardId}
                  period={period}
                  step={step}
                  days={days}
                  startTime={startTime}
                  timezone={timezone}
                />
              ) : connector === "shopify" ? (
                <ShopifyForm
                  user={user}
                  sessionToken={sessionToken}
                  workspaceId={workspaceId}
                  isScheduled={isScheduled}
                  isRunning={isRunning}
                  setIsRunning={setIsRunning}
                  setLoading={setLoading}
                  setSuccess={setSuccess}
                  boardId={boardId}
                  setBoardId={setBoardId}
                  period={period}
                  step={step}
                  days={days}
                  startTime={startTime}
                  timezone={timezone}
                />
              ) : null}
              <SchedulerBlock
                user={user}
                workspaceId={workspaceId}
                sessionToken={sessionToken}
                isScheduled={isScheduled}
                setIsScheduled={setIsScheduled}
                interval={period}
                setInterval={setPeriod}
                every={step}
                setEvery={setStep}
                days={days}
                setDays={setDays}
                startTime={startTime}
                setStartTime={setStartTime}
                timezone={timezone}
                setTimezone={setTimezone}
              />
              <RunBlock
                user={user}
                workspaceId={workspaceId}
                sessionToken={sessionToken}
                setIsRunning={setIsRunning}
                isScheduled={isScheduled}
                loading={loading}
                setLoading={setLoading}
                success={success}
                setSuccess={setSuccess}
                boardId={boardId}
                connector={connector}
                period={period}
                step={step}
                days={days}
                startTime={startTime}
                timezone={timezone}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
