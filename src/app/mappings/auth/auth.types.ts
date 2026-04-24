export type PostLogin = {
  email: string,
  password: string
}

export type PostAuthValidate = {
  idemployee: string,
  password: string,
}

export type PostCreateNip = {
  user_id: string,
  nip: string
}

export type PutChangePassword = {
  email: string,
  newPassword: string,
  changePassword: boolean
}

export type PostRecoverPassword = {
  email: string,
  type: "Email" | "SMS"
}

export type RecoverChannel = {
  type: "Email" | "SMS",
  value: string | null
}

export type RecoverPasswordResponse = {
  type: "Email" | "SMS",
  challengeId: string,
  phoneMasked?: string,
  emailMasked?: string,
  message: string,
  expiresInSeconds: number,
  nextStep: string
}

export type PostVerifyPasswordRecoveryCode = {
  challengeId: string,
  code: string
}

export type PostVerifyPasswordRecoverySms = {
  challengeId: string,
  token: string
}

export type PasswordRecoveryVerificationResponse = {
  message: string,
  challengeId: string,
  nextStep: string
}

export type PostResetPasswordRecovery = {
  challengeId: string,
  newPassword: string,
  confirmPassword: string
}

export type ResetPasswordRecoveryResponse = {
  success: boolean,
  message: string,
  nextStep: string
}

export type PutChangeNipStatus = {
    id: string
}

export type PutChangeNip = {
  user_id: string,
  nip: string
}

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
};

export type FirebaseData = {
  firebaseConfig: FirebaseConfig;
  userFirebase: string;
  paswordFirebase: string;
};

export type GetFirebaseConfiguration = {
  data: FirebaseData;
  success: boolean;
  error_Message: string;
  error_Code: number;
};

