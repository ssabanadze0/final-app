import FingerprintLoginButton from "@/components/FingerprintLoginButton";
import { useAuth } from "@/store/authContext";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as yup from "yup";

type LoginFormValues = {
  username: string;
  password: string;
};

const loginSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginForm({
  registerSuccess,
  onOpenRegister,
}: {
  registerSuccess: boolean;
  onOpenRegister: () => void;
}) {
  const { login, loading, error } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "johnd",
      password: "m38rmF$",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    await login(values.username, values.password, rememberMe);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Login to your account</Text>

      {registerSuccess && (
        <Text style={styles.successText}>
          Account created. You can log in now.
        </Text>
      )}

      <View style={styles.field}>
        <Text style={styles.label}>Username</Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="johnd"
              placeholderTextColor="#999"
              autoCapitalize="none"
              editable={!loading}
              style={styles.input}
            />
          )}
        />
        {errors.username && (
          <Text style={styles.errorText}>{errors.username.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <View style={styles.passwordRow}>
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="••••••••"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
                style={[styles.input, styles.passwordInput]}
              />
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeBtn}
              >
                <Text style={styles.eyeText}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </Pressable>
            </View>
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}
      </View>

      <Pressable
        style={styles.rememberRow}
        onPress={() => setRememberMe((prev) => !prev)}
      >
        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
          {rememberMe && <Text style={styles.checkboxTick}>✓</Text>}
        </View>
        <Text style={styles.rememberText}>Remember me</Text>
      </Pressable>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FingerprintLoginButton
        loading={loading}
        onPress={handleSubmit(onSubmit)}
        text="LOGIN"
      />

      <View style={styles.registerHintRow}>
        <Text style={styles.smallText}>Don&apos;t have an account?</Text>
        <Pressable onPress={onOpenRegister} style={styles.linkBtn}>
          <Text style={styles.linkText}>Create one</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  successText: {
    color: "#0a7a0a",
    fontSize: 13,
    marginBottom: 12,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fafafa",
    color: "#000",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
  },
  eyeBtn: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  eyeText: {
    fontSize: 12,
    color: "#555",
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#aaa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  checkboxTick: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 12,
  },
  rememberText: {
    fontSize: 13,
    color: "#444",
  },
  errorText: {
    color: "#d00",
    fontSize: 12,
    marginTop: 4,
  },
  submitBtn: {
    marginTop: 8,
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerHintRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  smallText: {
    fontSize: 13,
    color: "#555",
  },
  linkBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  linkText: {
    fontSize: 13,
    color: "#000",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
