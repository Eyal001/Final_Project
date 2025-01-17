import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequestWithPayload extends Request {
  user?: JwtPayload & { id: number; email: string };
  cookies?: JwtPayload & { id: number; email: string };
}
