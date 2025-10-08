"use client";
import { useState } from "react";
import Button from "@/uikit/button/button";
import Modal from "@/uikit/modal/modal";
import Input from "@/uikit/input/input";
import Selector from "@/uikit/selector";
import { useNotification } from "@/providers/notification/notifications";
import ChatIcon from "@/uikit/icons/chat-icon";
import { submitContact } from "@/utils/api";

export default function ContactCTA() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [formData, setFormData] = useState({
    email: "",
    topic: "",
    message: "",
  });

  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [emailInputError, setEmailInputError] = useState(false);
  const [topicError, setTopicError] = useState(false);
  const [messageInputError, setMessageInputError] = useState(false);

  const topicOptions = [
    "General Inquiry",
    "Bug Report",
    "Feature Request",
    "Song Report Access",
    "Payment Problem",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, topic, message } = formData;

    if (!email.trim()) setEmailInputError(true);
    if (!topic) setTopicError(true);
    if (!message.trim()) setMessageInputError(true);

    if (!email.trim() || !topic || !message.trim()) {
      return;
    }
    setLoading(true);

    try {
      await submitContact(topic, email, message);
      showNotification(
        "success",
        "Your message has been sent. We will contact you by email address you provided."
      );
      // optionally reset form here
      setFormData({ email: "", topic: "", message: "" });
      closeModal();
    } catch (error) {
      console.error("submitContact error:", error);
      // prefer server-provided message when available
      let errMsg = "There was an error sending message. Please try again.";
      if (error) {
        if (typeof error === "string" && error.trim()) errMsg = error;
        else if (typeof error.message === "string" && error.message.trim())
          errMsg = error.message;
        else if (
          error.payload &&
          typeof error.payload.message === "string" &&
          error.payload.message.trim()
        )
          errMsg = error.payload.message;
        else if (
          error.response &&
          error.response.data &&
          typeof error.response.data.message === "string"
        )
          errMsg = error.response.data.message;
      }
      showNotification("error", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3  fixed bottom-6 right-6 z-999">
        <button
          className="rounded-full border-standard size-13 flex items-center justify-center cursor-pointer shadow-base bg-white hover:bg-neutral-200 active:bg-neutral-400"
          onClick={openModal}
        >
          <ChatIcon size={32} />
        </button>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} title="Contact Us">
        <form className="w-full flex flex-col gap-6">
          <Selector
            value={formData.topic}
            onChange={(topic) => {
              setFormData({ ...formData, topic });
              setTopicError(false);
            }}
            options={topicOptions}
            required
            placeholder="Select relevant topic"
            error={topicError}
            label="Topic"
          />
          {/* inline topic error (same style as input error) */}
          {topicError && (
            <div className="text-xs text-red-500">You should select topic</div>
          )}
          <Input
            type="plain"
            label="Email"
            value={formData.email}
            error={emailInputError}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            onFocus={() => setEmailInputError(false)}
            required
            placeholder="Enter your email address"
          />

          <Input
            type="textarea"
            label="Message"
            value={formData.message}
            error={messageInputError}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            onFocus={() => setMessageInputError(false)}
            required
            placeholder="Enter your message here"
          />
          <Button
            type="submit"
            variant="primary"
            size="m"
            fullWidth
            onClick={handleSubmit}
            loading={loading}
          >
            Submit message
          </Button>
        </form>
      </Modal>
    </>
  );
}
