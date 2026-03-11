"use client";

import { FormEvent, useRef, useState } from "react";
import { loadUserId, TOKEN_KEY } from "@/utils/auth-storage";
import { initialPetitionState, services, type PetitionFormState } from "../data";

// Components
import PetitionHeader from "./components/PetitionHeader";
import PetitionForm from "./components/PetitionForm";

const petitionService = services.find((service) => service.id === "kien-nghi");
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE ??
  "http://localhost:8080/resident-management";

const createEmptyPetitionState = (): PetitionFormState => ({
  ...initialPetitionState,
});

export default function PetitionPage() {
  const [petitionState, setPetitionState] = useState<PetitionFormState>(() =>
    createEmptyPetitionState()
  );
  const [petitionMessage, setPetitionMessage] = useState<string>("");

  const editorRef = useRef<HTMLDivElement | null>(null);

  const handlePetitionChange = <
    Field extends keyof PetitionFormState
  >(
    field: Field,
    value: PetitionFormState[Field]
  ) => {
    setPetitionState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRichTextChange = () => {
    if (!editorRef.current) return;
    handlePetitionChange("content", editorRef.current.innerHTML);
  };

  const handlePetitionSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const userId = loadUserId();
      if (!userId) return;

      const formData = new FormData();
      formData.append("name", petitionState.fullName);
      formData.append("email", petitionState.email);
      formData.append("phone", petitionState.phone);
      formData.append("address", petitionState.address);
      formData.append("title", petitionState.title);
      formData.append("description", petitionState.content);

      if (petitionState.attachment) {
        formData.append("file", petitionState.attachment);
      }

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem(TOKEN_KEY)
          : null;

      const response = await fetch(
        `${API_BASE_URL}/feedbacks/${userId}`,
        {
          method: "POST",
          body: formData,
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setPetitionMessage("Gửi thành công! Phản ánh của bạn đã được ghi nhận.");
      handlePetitionReset();
    } catch (error) {
      console.error("Submit petition error:", error);
    }
  };

  const handlePetitionReset = () => {
    setPetitionState(createEmptyPetitionState());
    setPetitionMessage("");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PetitionHeader
        petitionServiceName={petitionService?.name}
        petitionServiceDescription={petitionService?.description}
      />

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        <PetitionForm
          petitionState={petitionState}
          handlePetitionChange={handlePetitionChange}
          handlePetitionSubmit={handlePetitionSubmit}
          handlePetitionReset={handlePetitionReset}
          editorRef={editorRef}
          handleEditorInput={handleRichTextChange}
          petitionMessage={petitionMessage}
        />
      </main>
    </div>
  );
}
