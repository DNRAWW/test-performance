export type TUser = {
  id: string,
  email: string,
  username: string
}

export type TJwtPayload = {
  email: string;
  sub: string;
};
