"use client";
import React, { useState } from "react";
import Input from "@/uikit/input/input";
import PasswordInput from "@/uikit/input/password-input";
import Button from "@/uikit/button/button";
import { isEmail } from "@/utils/validators";

export default function Login({ onSubmit, loading = false }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let ok = true;
    if (!email || !String(email).trim()) {
      setEmailError("Email is required");
      ok = false;
    } else if (!isEmail(email)) {
      setEmailError("Email is invalid");
      ok = false;
    } else {
      setEmailError("");
    }

    if (!password || !String(password).trim()) {
      setPasswordError("Password is required");
      ok = false;
    } else {
      setPasswordError("");
    }

    return ok;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || loading) {
      return;
    }
    onSubmit?.({ email: email.trim(), password });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit(e);
    }
  };

  return (
    <form className="w-full max-w-sm mx-auto" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) setEmailError("");
        }}
        onFocus={() => emailError && setEmailError("")}
        placeholder="you@example.com"
        error={!!emailError}
        required
        disabled={loading}
      />
      {emailError && <div className="text-xs text-red-500 mt-1">{emailError}</div>}

      <div className="mt-4">
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError("");
          }}
          onFocus={() => passwordError && setPasswordError("")}
          placeholder="Enter your password"
          error={!!passwordError}
          required
          disabled={loading}
        />
      </div>
      {passwordError && <div className="text-xs text-red-500 mt-1">{passwordError}</div>}

      <div className="mt-6">
        <Button 
          type="submit" 
          variant="black" 
          size="m" 
          fullWidth
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
        >
          Sign in
        </Button>
      </div>
    </form>
  );
}