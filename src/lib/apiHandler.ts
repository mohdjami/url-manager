//await the functions according to action
// lib/apiHandler.ts
import { forgotPassword, verifyToken, resetPassword } from "./passwordReset";

export async function handleAction(action: string, req: any, res: any) {
  switch (action) {
    case "forgot-password":
      await forgotPassword(req, res);
      break;
    case "verify-token":
      await verifyToken(req, res);
      break;
    case "reset-password":
      await resetPassword(req, res);
      break;
    default:
      res.status(400).json({ error: "Invalid action" });
  }
}
