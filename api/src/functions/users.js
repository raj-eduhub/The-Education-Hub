import { app } from "@azure/functions";
import { developmentBypass, getPrincipal, isAdministrator } from "../lib/auth.js";
import { deleteUser, listUsers, saveUser, updateUser } from "../lib/userStore.js";

function forbidden() {
  return { status: 403, jsonBody: { error: "An administrator account is required." } };
}

app.http("users", {
  methods: ["GET", "POST", "PATCH", "DELETE"],
  authLevel: "anonymous",
  route: "users/{id?}",
  handler: async (request, context) => {
    try {
      const principal = await getPrincipal(request);
      if (!developmentBypass() && !isAdministrator(principal)) return forbidden();

      const id = request.params.id;
      if (request.method === "GET") {
        return { jsonBody: { users: await listUsers() } };
      }

      if (request.method === "POST") {
        const body = await request.json();
        const name = body.name?.trim();
        const email = body.email?.trim();
        const role = body.role;
        if (!name || !email || !["student", "parent", "teacher"].includes(role)) {
          return { status: 400, jsonBody: { error: "Name, email, and a valid access type are required." } };
        }
        return { status: 201, jsonBody: { user: await saveUser({ name, email, role }) } };
      }

      if (!id) return { status: 400, jsonBody: { error: "A user id is required." } };

      if (request.method === "PATCH") {
        const body = await request.json();
        if (!["active", "inactive"].includes(body.status)) {
          return { status: 400, jsonBody: { error: "Status must be active or inactive." } };
        }
        return { jsonBody: { user: await updateUser(id, { status: body.status }) } };
      }

      await deleteUser(id);
      return { status: 204 };
    } catch (error) {
      context.error(error);
      const status = error.statusCode === 404 ? 404 : 500;
      return { status, jsonBody: { error: status === 404 ? "User not found." : "User management is unavailable." } };
    }
  },
});
