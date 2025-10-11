import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// tus imports aquí...
import DashboardHome from "../../screens/private/DashboardHome";
import Blog from "../../screens/private/Blog/Blog";
import Petitions from "../../screens/private/Petitions";
import Directory from "../../screens/public/directory/Directory";
import BusinessPage from "../../screens/private/BusinessPage/BusinessPage";
import Exchange from "../../screens/public/Exchange";
import Contact from "../../screens/private/Contact";
import News from "../../screens/private/News/News";
import ChantelleNews from "../../screens/private/News/ChantelleNews";
import YandriNews from "../../screens/private/News/YandriNews";
import FirstBornTribeNews from "../../screens/private/News/FirstBornTribeNews";
import BusinessNews from "../../screens/private/News/BusinessNews";
import Admin from "../../screens/private/Admin/Admin";
import BlogDetails from "../../screens/private/Blog/BlogDetails";
import Profile from "../../screens/private/Profile";
import AreYouVotingForAmmonForm from "../../screens/private/Petitions/AmmonPetition";
import DoYouHaveACredencial from "../../screens/private/Petitions/CredencialPetition";
import RepresentativeForm from "../../screens/private/Petitions/RepresentativeForm";
import SecurityPetition from "../../screens/private/Petitions/SecurityPetition";
import Groups from "../../screens/private/Groups/Groups";
import JoinGroup from "../../screens/private/Groups/JoinGroup";
import CreateGroup from "../../screens/private/Groups/CreateGroup";
import AdminBusinessPage from "../../screens/private/Admin/AdminBusinessPage/AdminBusinessPage";
import Calendar from "../../screens/private/Calendar/Calendar";
import RaffleCheckout from "../../screens/private/raffle/RaffleCheckout";
import RaffleCheckoutSuccess from "../../screens/private/raffle/RaffleCheckoutSuccess";
import YouthOfIsrael from "../../screens/private/YOI/YOI";
import Forum from "../../screens/private/Forum/Forum";
import ForumPost from "../../screens/private/Forum/ForumPost";
import MyTickets from "../../screens/private/raffle/MyTickets";
import Manage from "../../screens/private/Subscription/Manage";
import Success from "../../screens/private/Subscription/Success";

// Traductor (tus componentes custom)
import Traductor from "./traductor/traductorr";
import Peticiones from "./traductor/peticiones";
import NuevasPeticiones from "./traductor/nuevoTask";
import Imagenes from "./traductor/imagenes";
import Sociales from "./traductor/sociales/Sociales";
import NewForumPost from "./traductor/newforum/NewForumPost";
import NewForum from "./traductor/newforum/newForum";
import DirectMessaging from "./traductor/directMessaging";
import GroupMessaging from "./traductor/GroupMessaging";
import AddMember from "./traductor/AddMember";
import NewPeticionPost from "./traductor/newforum/newpeticionpost";
import Diagram from "./traductor/Diagram";
import RequireAdmin from "../HOC/requireAdmin";

const AuthLinks = () => {
  const [usuarioName, setUsuarioName] = useState("");
  const [usuario, setUsuario] = useState("");

  return (
    <Routes>
      {/* Dashboard */}
      <Route
        path="/"
        element={
          <DashboardHome
            setUsuario={setUsuario}
            setUsuarioName={setUsuarioName}
            usuario={usuario}
            usuarioName={usuarioName}
          />
        }
      />
      <Route path="home" element={<DashboardHome />} />
      <Route path="calendar" element={<Calendar />} />

      {/* Traductor */}
      <Route
        path="traductor"
        element={
          <Traductor
            usuario={usuario}
            usuarioName={usuarioName}
            setUsuario={setUsuario}
            setUsuarioName={setUsuarioName}
          />
        }
      />
      <Route
        path="peticiones"
        element={
          <Peticiones
            usuario={usuario}
            usuarioName={usuarioName}
            setUsuario={setUsuario}
            setUsuarioName={setUsuarioName}
          />
        }
      />
      <Route
        path="nuevaspeticiones"
        element={
          <NuevasPeticiones
            usuario={usuario}
            usuarioName={usuarioName}
            setUsuario={setUsuario}
            setUsuarioName={setUsuarioName}
          />
        }
      />
      <Route path="imagen" element={<Imagenes />} />
      <Route path="sociales" element={<Sociales />} />
      <Route path="diagram" element={<Diagram />} />
      <Route path="groupss" element={<GroupMessaging />} />
      <Route path="addmember" element={<AddMember />} />
      <Route path="direcmassaging/:userId" element={<DirectMessaging />} />

      {/* Blog */}
      <Route path="blog" element={<Blog />} />
      <Route path="blogDetails/:blogId" element={<BlogDetails />} />

      {/* Petitions */}
      <Route path="petitions" element={<Petitions />} />
      <Route path="petitions/Ammon" element={<AreYouVotingForAmmonForm />} />
      <Route path="petitions/Credencial" element={<DoYouHaveACredencial />} />
      <Route path="petitions/Representative" element={<RepresentativeForm />} />
      <Route path="petitions/Security" element={<SecurityPetition />} />

      {/* Groups */}
      <Route path="groups" element={<Groups />} />
      <Route path="joinGroup" element={<JoinGroup />} />
      <Route path="createGroup" element={<CreateGroup />} />

      {/* Directory / Business / Exchange */}
      <Route path="directory" element={<Directory />} />
      <Route path="businessPage/:pageId" element={<BusinessPage />} />
      <Route path="exchange" element={<Exchange />} />
      <Route path="contact" element={<Contact />} />

      {/* News */}
      <Route path="news" element={<News />} />
      <Route path="news/Chantelle" element={<ChantelleNews />} />
      <Route path="news/Yandri" element={<YandriNews />} />
      <Route path="news/FBT" element={<FirstBornTribeNews />} />
      <Route path="news/Business" element={<BusinessNews />} />

      {/* YOI */}
      <Route path="YOI" element={<YouthOfIsrael />} />

      {/* Forum */}
      <Route path="community" element={<Forum />} />
      <Route path="communityPost/:postId" element={<ForumPost />} />
      <Route path="newcommunity" element={<NewForum />} />
      <Route path="newcommunityPost/:postId" element={<NewForumPost />} />
      <Route path="newpeticionesPost/:peticionId" element={<NewPeticionPost />} />

      {/* Classifieds */}
      <Route path="classifieds" element={<DashboardHome />} />

      {/* Profile / Subscription */}
      <Route path="profile" element={<Profile />} />
      <Route path="subscription" element={<Manage />} />
      <Route path="subscription/success" element={<Success />} />

      {/* Admin */}
      <Route
        path="admin"
        element={
          <RequireAdmin>
            <Admin />
          </RequireAdmin>
        }
      />
      <Route
        path="admin/businessPage/:pageId"
        element={
          <RequireAdmin>
            <AdminBusinessPage />
          </RequireAdmin>
        }
      />

      {/* Raffle */}
      <Route path="raffle" element={<RaffleCheckout />} />
      <Route path="raffle/success" element={<RaffleCheckoutSuccess />} />
      <Route path="raffle/MyTickets" element={<MyTickets />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
      
      {/* Página de error de permisos */}
      {/* <Route path="403" element={<NoPermission />} /> */}

      {/* Fallback 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

const UnAuthLinks = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardHome />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export { AuthLinks, UnAuthLinks };
