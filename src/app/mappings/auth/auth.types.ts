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

export type PutRecoverPassword = {
    username: string
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

