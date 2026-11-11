import { defineHandler } from "h3";

export default defineHandler(() => {
	return { ok: true, service: "eams-api", nitro: 3, h3: 2 };
});
