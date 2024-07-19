import { useState, useMemo, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import { Dropdown, Button } from "monday-ui-react-core";
import Nango from "@nangohq/frontend";
import {
  FacebookService,
  GoogleService,
  HTTPAuthorizationCredentials,
  User,
  UsersService,
} from "../api";
import { FacebookAdsForm } from "../Components/FacebookAdsForm";
import { FacebookPagesForm } from "../Components/FacebookPagesForm";
import { InstagramPostsForm } from "../Components/InstagramPostsForm";
import { GoogleAdsForm } from "../Components/GoogleAdsForm";
import { CustomApiForm } from "Components/CustomApiForm";
import { Guide } from "../Components/Modals/OnboardingGuideModal";

const monday = mondaySdk();

export const Connector = () => {
  const [connector, setConnector] = useState();
  const [connected, setConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<User>();
  const [sessionToken, setSessionToken] = useState<string>();
  const [workspaceId, setWorkspaceId] = useState<number>();
  const [isViewer, setIsViewer] = useState(false);

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

  const options = useMemo(
    () => [
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
      // {
      //   value: "google_ads",
      //   label: "Google Ads",
      //   leftAvatar: getIconUrl("google-ads-icon"),
      // },
    ],
    []
  );

  async function getSessionToken() {
    return (await monday.get("sessionToken")).data;
  }

  async function updateUser(connectionId: string) {
    const token = await getSessionToken();

    setSessionToken(token);

    const requestBody: HTTPAuthorizationCredentials = {
      scheme: "Bearer",
      credentials: token,
    };

    if (
      connector === "facebook" ||
      connector === "facebook_pages" ||
      connector === "instagram"
    ) {
      FacebookService.facebookLogin(connectionId, requestBody).then(
        (user: User) => {
          setUser(user);
        }
      );
    } else {
      GoogleService.googleLogin(connectionId, requestBody).then(
        (user: User) => {
          setUser(user);
        }
      );
    }
  }

  const nango = new Nango({
    publicKey:
      process.env.REACT_APP_NANGO_KEY || "7b73b776-3a10-41c0-a5ee-feef16d372d4",
  });

  const connect = () => {
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
    } else if (connector === "google_ads") {
      nango
        .auth("google", "google-prod")
        .then((result) => {
          updateUser(result.connectionId);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      await getSessionToken().then((sessionToken) => {
        if (sessionToken) {
          setSessionToken(sessionToken);
          UsersService.usersReadUserByMondaySession(sessionToken)
            .then((user: User) => {
              setUser(user);
            })
            .catch((err) => {
              const url =
                process.env.REACT_APP_MONDAY_AUTH_URI ||
                "https://auth.monday.com/oauth2/authorize?client_id=f45cc62f0e9a56c58ab714a159487c11&redirect_uri=http://localhost:80/api/v1/monday/callback";
              window.location.href = url;
            });
        }
      });
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (
      (connector === "facebook" ||
        connector === "facebook_pages" ||
        connector === "instagram") &&
      user?.facebook_token
    ) {
      setConnected(true);
    } else if (connector === "google_ads" && user?.google_token) {
      setConnected(true);
    } else if (connector === "custom_api") {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [connector, user?.facebook_token, user?.google_token]);

  const openGuideClick = () => {
    setShowModal(true);
  };

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
          <Button
            kind={Button.kinds.TERTIARY}
            className="absolute right-3 top-2 text-sm text-gray-500 font-bold"
            onClick={openGuideClick}
          >
            How to use
          </Button>
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
              <p className="font-bold text-gray-500 text-xs">* Application</p>
              <Dropdown
                placeholder="Select an application"
                options={options}
                onOptionSelect={(e: any) => setConnector(e.value)}
              />
              {connected === true && connector !== "custom_api" ? (
                <Button
                  kind={Button.kinds.TERTIARY}
                  className="text-xs text-gray-500 font-bold underline m-0 p-0 h-0"
                  onClick={() => connect()}
                >
                  Connect to different account?
                </Button>
              ) : connector !== "custom_api" ? (
                <Button onClick={() => connect()} className="mt-2">
                  Connect
                </Button>
              ) : null}
            </>
          )}
        </div>
        <div>
          {connected && user && workspaceId && (
            <>
              {connector === "facebook" ? (
                <FacebookAdsForm
                  user={user}
                  sessionToken={sessionToken}
                  workspaceId={workspaceId}
                />
              ) : connector === "facebook_pages" ? (
                <FacebookPagesForm
                  user={user}
                  sessionToken={sessionToken}
                  workspaceId={workspaceId}
                />
              ) : connector === "instagram" ? (
                <InstagramPostsForm
                  user={user}
                  sessionToken={sessionToken}
                  workspaceId={workspaceId}
                />
              ) : connector === "google_ads" ? (
                <GoogleAdsForm
                  user={user}
                  sessionToken={sessionToken}
                  workspaceId={workspaceId}
                />
              ) : connector === "custom_api" ? (
                <CustomApiForm
                  sessionToken={sessionToken}
                  workspaceId={workspaceId}
                />
              ) : null}
            </>
          )}
        </div>
        <Guide showModal={showModal} setShowModal={setShowModal} />
      </div>
    </>
  );
};
