// app/profile.tsx
import { useAuth } from "@/store/authContext";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as yup from "yup";

type LoginForm = {
  username: string;
  password: string;
};

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export default function Profile() {
  const { user, login, logout, loading, error } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "johnd", // pre-filled for you
      password: "m38rmF$",
    },
  });

  async function onSubmit(values: LoginForm) {
    // later you can use rememberMe here
    await login(values.username, values.password);
  }

  // ---------- LOGGED IN: show profile ----------
  if (user) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{user.username}</Text>

        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>
          {user.name.firstname} {user.name.lastname}
        </Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{user.phone}</Text>

        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>
          {user.address.street} {user.address.number}, {user.address.city}{" "}
          {user.address.zipcode}
        </Text>

        <Pressable style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // ---------- NOT LOGGED IN: login form ----------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Username */}
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
              style={styles.input}
            />
          )}
        />
        {errors.username && (
          <Text style={styles.errorText}>{errors.username.message}</Text>
        )}
      </View>

      {/* Password + show/hide */}
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

      {/* Remember me */}
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

      <Pressable
        style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Log in</Text>
        )}
      </Pressable>
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
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
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
  value: {
    fontSize: 14,
    marginBottom: 8,
  },
  logoutBtn: {
    marginTop: 24,
    backgroundColor: "#eee",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#000",
    fontWeight: "600",
  },
});
