const errors = {
    "auth/wrong-password": "Senha incorreta",
    "auth/user-not-found": "Usuário inexistente",
    "auth/weak-password": "Senha fraca",
    "auth/too-many-requests": "Muitas requisições realizadas",
    "auth/email-already-in-use": "Conta já registrada com este email",
  };

  export const firebaseError = (code) => errors[code] ?? "Um erro ocorreu";