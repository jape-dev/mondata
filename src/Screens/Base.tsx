import React, { useState, useEffect } from "react";
import { TabList, Tab } from "monday-ui-react-core";
import { UserPublic, UsersService, Plan } from "../api";
import mondaySdk from "monday-sdk-js";
import { ScheduleTable } from "./Schedule";
import { Connector } from "./Connector";
import { GuideModal } from "../Components/Modals/OnboardingGuideModal";
import { UpgradeModal } from "Components/Modals/UpgradeModal";
import longLogo from "../Static/images/long-logo.png";
import { Button } from "monday-ui-react-core";
import { RunsRemainingBar } from "../Components/Nav/RunsRemainingBar";

const monday = mondaySdk();

const BaseScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [sessionToken, setSessionToken] = useState<string | undefined>();
  const [user, setUser] = useState<UserPublic>();
  const [guideModal, setGuideModal] = useState<boolean>(false);
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [accountSlug, setAccountSlug] = useState<string>();

  useEffect(() => {
    monday.get("location").then((res: any) => {
      if (res.data && res.data.href) {
        const url = new URL(res.data.href);
        const hostname = url.hostname;
        const parts = hostname.split(".");
        if (parts.length > 2) {
          setAccountSlug(
            `${parts[0]}.monday.com/marketplace/v2/app/installed/10150307`
          );
        }
      }
    });
  }, []);

  async function getSessionToken() {
    return (await monday.get("sessionToken")).data;
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (!sessionToken) {
        await getSessionToken().then((newSessionToken) => {
          if (newSessionToken) {
            setSessionToken(newSessionToken);
            fetchUserData(newSessionToken);
          }
        });
      } else {
        fetchUserData(sessionToken);
      }
    };

    const fetchUserData = (token: string) => {
      UsersService.usersReadUserByMondaySession(token)
        .then((user: UserPublic) => {
          setUser(user);
        })
        .catch((err) => {
          const url =
            process.env.REACT_APP_MONDAY_AUTH_URI ||
            "https://auth.monday.com/oauth2/authorize?client_id=f45cc62f0e9a56c58ab714a159487c11&redirect_uri=http://localhost:80/api/v1/monday/callback";
          window.location.href = url;
        });
    };

    fetchUser();
  }, [sessionToken]);

  const handleScheduleTabClick = () => {
    if (user && user.plan === Plan.FREE) {
      setUpgradeModal(true);
    } else {
      setActiveTab(1);
    }
  };

  const handleUpgradeClick = () => {
    const link = accountSlug
      ? `https://${accountSlug}`
      : "https://monday.com/marketplace/listing/10000557/data-importer";
    window.open(link, "_blank");
  };

  return (
    <div>
      <div className="grid grid-cols-12 flex flex-wrap">
        <div
          className={`${
            user?.plan === Plan.PRO
              ? "col-span-12 lg:col-span-8"
              : "col-span-12 sm:col-span-6 lg:col-span-3"
          } border-b-2 border-gray-250 h-10`}
        >
          <div className="flex justify-start h-10 items-center pl-4">
            <img src={longLogo} alt="Logo" className="h-6 !m-0" />
            <Button
              onClick={handleUpgradeClick}
              size={Button.sizes.SMALL}
              className="!h-6 ml-3 !text-xs"
              kind={Button.kinds.SECONDARY}
            >
              {user?.plan === Plan.FREE ? "Upgrade" : "Pro"}
            </Button>
          </div>
        </div>
        {user?.plan === Plan.FREE && (
          <div className="hidden sm:block col-span-6 lg:col-span-5 border-b-2 border-gray-250 h-9 mt-1">
            <div className="self-center w-full sm:w-2/3 lg:w-1/3 ml-auto mr-4">
              <RunsRemainingBar
                sessionToken={sessionToken}
                user={user}
                className="justify-self-end"
              />
            </div>
          </div>
        )}
        <div className="col-span-12 sm:col-span-12 lg:col-span-4 flex justify-end border-b-2 border-gray-250 h-10 text-sm">
          <TabList activeTabId={activeTab}>
            <Tab onClick={() => setActiveTab(0)}>New Import</Tab>
            <Tab onClick={handleScheduleTabClick}>Schedule</Tab>
            <Tab
              onClick={() =>
                window.open("https://dataimporter.co/blog", "_blank")
              }
            >
              Tutorials
            </Tab>
          </TabList>
        </div>
      </div>
      <div>
        {activeTab !== 1 ? (
          <Connector sessionToken={sessionToken} user={user} />
        ) : (
          <ScheduleTable sessionToken={sessionToken} user={user} />
        )}
      </div>
      <GuideModal showModal={guideModal} setShowModal={setGuideModal} />
      <UpgradeModal
        showModal={upgradeModal}
        setShowModal={setUpgradeModal}
        title="Upgrade to schedule imports"
        text="Scheduled imports run automatically, even if you are not logged into monday.com or do not have Data Importer open."
      />
    </div>
  );
};

export default BaseScreen;
