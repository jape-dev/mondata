import { useState, useMemo, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import { Dropdown, Button } from "monday-ui-react-core";
import Nango from "@nangohq/frontend";
import {
  FacebookService,
  HTTPAuthorizationCredentials,
  User,
  UsersService,
} from "../api";
import { FacebookAdsForm } from "../Components/FacebookAdsForm";
import { FacebookPagesForm } from "../Components/FacebookPagesForm";

const monday = mondaySdk();

export const Connector = () => {
  const [connector, setConnector] = useState();
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState<User>();

  const getIconUrl = (imgPath: string) => {
    return require(`../Static/images/${imgPath}.png`);
  };

  const options = useMemo(
    () => [
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
        label: "Instagram",
        leftAvatar: getIconUrl("instagram-icon"),
      },
      {
        value: "google",
        label: "Google Ads",
        leftAvatar: getIconUrl("google-ads-icon"),
      },
      {
        value: "google-analytics",
        label: "Google Analytics",
        leftAvatar: getIconUrl("google-analytics-icon"),
      },
    ],
    []
  );

  async function getSessionToken() {
    return (await monday.get("sessionToken")).data;
  }

  async function updateUser(connectionId: string) {
    const sessionToken = await getSessionToken();

    const requestBody: HTTPAuthorizationCredentials = {
      scheme: "Bearer",
      credentials: sessionToken,
    };

    FacebookService.facebookLogin(connectionId, requestBody).then(
      (user: User) => {
        setUser(user);
      }
    );
  }

  const nango = new Nango({
    publicKey:
      process.env.REACT_APP_NANGO_KEY || "7b73b776-3a10-41c0-a5ee-feef16d372d4",
  });

  const connect = () => {
    if (connector === "facebook") {
      nango
        .auth("facebook", "test-connection-id", {
          authorization_params: { config_id: "728465868571401" },
        })
        .then((result) => {
          updateUser(result.connectionId);
          // save id to the database.
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
          UsersService.usersReadUserByMondaySession(sessionToken).then(
            (user: User) => {
              console.log(user);
              setUser(user);
            }
          );
        }
      });
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (
      (connector === "facebook" || connector === "facebook_pages") &&
      user?.facebook_token
    ) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [connector]);

  return (
    <div className="p-2">
      <div className="border-2 border-gray rounded-md p-5 mb-2">
        <p className="font-bold text-gray-500 text-sm">* Application</p>
        <Dropdown
          placeholder="Select an application"
          options={options}
          onOptionSelect={(e: any) => setConnector(e.value)}
        />
        {connected === false && (
          <Button onClick={() => connect()} className="mt-2">
            Connect
          </Button>
        )}
      </div>
      {connected && user && (
        <>
          {connector === "facebook" ? (
            <FacebookAdsForm user={user} />
          ) : (
            <FacebookPagesForm user={user} />
          )}
        </>
      )}
    </div>
  );
};