import { useAuth } from "@/store/authContext";
import React, { useState } from "react";
import LoggedInView from "./LoggedInView";
import LoginForm from "./LoginForm";
import RegisterModal from "./RegisterModal";

export default function Profile() {
  const { user } = useAuth();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  if (user) {
    return <LoggedInView />;
  }

  return (
    <>
      <LoginForm
        registerSuccess={registerSuccess}
        onOpenRegister={() => setShowRegisterModal(true)}
      />

      <RegisterModal
        visible={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => setRegisterSuccess(true)}
      />
    </>
  );
}
