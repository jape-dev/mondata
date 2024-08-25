import React, { useState, useEffect } from 'react';
import { TabList, Tab } from "monday-ui-react-core";
import { UserPublic, UsersService, Plan } from "../api";
import mondaySdk from "monday-sdk-js";
import { ScheduleTable } from "./Schedule";
import { Connector } from "./Connector";
import { Guide } from "../Components/Modals/OnboardingGuideModal";
import { UpgradeModal } from 'Components/Modals/UpgradeModal';
import longLogo from '../Static/images/long-logo.png';


const monday = mondaySdk();

const BaseScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [sessionToken, setSessionToken] = useState<string | undefined>();
  const [user, setUser] = useState<UserPublic>();
  const [guideModal, setGuideModal] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState(false);

  
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


  return (
    <div>
      <div className="grid grid-cols-12 ">
        <div className="col-span-8 border-b-2 border-gray-250 h-10">
          <div className="flex justify-start h-10 items-center pl-4">
            <img src={longLogo} alt="Logo" className="h-6 !m-0" />
          </div>
        </div>
        <div className="col-span-4 flex justify-end border-b-2 border-gray-250 h-10">
          <TabList activeTabId={activeTab} >
            <Tab onClick={() => setActiveTab(0)}>New Import</Tab>
            <Tab onClick={handleScheduleTabClick}>Schedule</Tab>
            <Tab onClick={() => setGuideModal(true)}>How to use</Tab>
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
      <Guide showModal={guideModal} setShowModal={setGuideModal} />
      <UpgradeModal showModal={upgradeModal} setShowModal={setUpgradeModal} title="Upgrade to schedule imports" text="Scheduled imports run automatically, even if you are not logged into monday.com or do not have Data Importer open." />
    </div>
  );
};

export default BaseScreen;