# NCRPTS-Reference — REUSE INDEX

> **What this file is.** A lookup table from **"the thing I want to reuse" → the exact file(s) + which version to take it from**. The point is to never load a whole version folder into a chat again: say *"reuse the JWT security setup"*, I check this table, and pull only those 3–4 files. Keep it in `index/`; copy into project knowledge.
>
> **Golden rule when reusing:** every file you lift is written for **`lk.earth.earthuniversity`** / "Earth University". Before it enters your repo, translate the package, class names, schema (`sltdb`), and domain nouns to yours — see `CLAUDE.md` for the exact rename map. Reuse the *pattern*, not the *domain*.

**Path shorthand** (fill `<V>` with the recommended version):
- **`S/`** = `<V>/ServerApp/src/main/java/lk/earth/earthuniversity/`
- **`C/`** = `<V>/ClientApp/src/app/`

---

## A. Architecture patterns (the shapes to copy for every new module)

The sample has no service layer — **the controller IS the service** (business logic lives in the controller; DAO is a thin Spring Data interface; entity is plain JPA). Copy this trio for each new module:

| Pattern | Take from | Files | Notes |
|---|---|---|---|
| **Server "one module" trio** (Controller + DAO + Entity) | V4 | `S/controller/EmployeeController.java`, `S/dao/EmployeeDao.java`, `S/entity/Employee.java` | The canonical worked example (the master-guide module). Everything else is this with different nouns. |
| **Client "one module" quartet** (component.ts + .html + service + entity) | V4 | `C/view/modules/employee/employee.component.ts` + `.html`, `C/service/employeeservice.ts`, `C/entity/employee.ts` | Angular DI pattern: component injects the service, service calls the API. |
| **Add-a-master-data-module** worked twice | V2 (Item), V3-B (Supplier) | `S/controller/ItemController.java` / `SupplierController.java` (+ their dao/entity) | Two extra examples if Employee alone isn't enough. |
| **Transaction module with line-items** (header + detail) | V4 | `S/entity/Puorder.java` + `S/entity/Puoitem.java` + `S/controller/PuorderController.java` | Closest thing to your request→estimate→job pattern (a parent record with child line items). Study this before building requests/estimates. |

---

## B. Security / auth (JWT + Spring Security + RBAC) — the highest-value reuse

Your dissertation makes RBAC a hard requirement, and this is already built. Take the **whole `security/` package from V4** as a unit:

| Piece | Take from | Files |
|---|---|---|
| **Server JWT + security config** | V4 | `S/security/WebSecurityConfig.java`, `JwtAuthenticationFilter.java`, `JwtAuthorizationFilter.java`, `JwtTokenUtil.java`, `LoginController.java`, `LoginRequest.java`, `UserService.java` |
| **Client auth flow** | V4 | `C/service/AuthenticateService.ts`, `C/service/JwtInterceptor.ts` (attaches token to every request; wired in `app.module.ts` as `HTTP_INTERCEPTORS`), `C/service/authorizationmanager.ts`, `C/service/authoritysevice.ts`, `C/service/userservice.ts` |
| **RBAC data model** | V4 | `S/entity/{User,Role,Userrole,Privilege,Operation,Module}.java` + matching controllers |

⚠️ **Before deploy:** the template ships with `@PreAuthorize` commented out, `jwt.secret=mySecretKey`, and DB root/empty password (see `PROJECT-CONTEXT.md` ledger #5). Reuse the machinery, but **re-enable per-module authorization + externalize secrets** — marks depend on it.

---

## C. Validation

| Pattern | Take from | Files | Notes |
|---|---|---|---|
| **Server-side regex validation** | V4 | `S/util/RegexPattern.java`, `S/util/RegexProvider.java`, `S/controller/RegexController.java` | Central regex registry exposed to the client. |
| **Client-side regex validation service** | V4 | `C/service/regexservice.ts` | Mirrors the server patterns so forms validate before submit. |

---

## D. Reporting (Google Charts, one live end-to-end example)

| Piece | Take from | Files | Notes |
|---|---|---|---|
| **Server report projection** | V4 | `S/report/ReportController.java`, `S/report/entity/CountByDesignation.java`, `S/report/dao/CountByDesignaitonDao.java` [sic — typo is in the original filename] | Uses a JPA projection/aggregate, not a full entity. The pattern to copy for your 5 management reports. |
| **Client report render** | V4 | `C/report/` (component + Google Charts loader is in `ClientApp/src/index.html`) | Google Charts is loaded via a script tag in `index.html`, not npm — remember to carry that over. |

---

## E. Shared UI plumbing (small, reusable, easy to forget)

| Piece | Take from | Files | Notes |
|---|---|---|---|
| **Confirm dialog** (reusable Material dialog) | V4 | `C/util/dialog/` | Used before delete/insert confirmations throughout. |
| **Dark-mode toggle** | V4 | `C/service/DarkModeService.ts` | Optional nice-to-have. |
| **Main shell / nav** | V4 | `C/view/mainwindow/`, `C/view/login/`, `C/app-routing.module.ts` | The app frame + routing table. Rebrand SLT here. |

---

## F. Two pagination + three search variants (from the master guide, located in code)

The master guide teaches these as sub-versions of the Employee module. Where they live in the actual code:

| Technique | Where to look | Notes |
|---|---|---|
| **Client-side pagination** (server returns all rows, client paginates) | V4 `S/controller/EmployeeController.java` — plain `findAll()`, no `Pageable` | This is what the repo actually ships with (no `Pageable`/`PageRequest` in the controllers). Fine for small tables. |
| **Server-side pagination** (`Pageable`/`PageRequest`) | **Not in the committed controllers** — it's the "Version-2" variant described step-by-step in `master-guide.md` §6+ | If you need it for big tables (requests, jobs), follow the master guide's server-pagination recipe rather than copying a file. |
| **Search: per-column / template-direct / pipe-and-filter** | `master-guide.md` §19–21; client search UIs under `C/view/modules/employee/` | Three approaches documented; pick per screen. |

---

## G. Database schemas to mine (for shaping your own tables)

Restore the right dump (see `VERSION-DELTAS.md` §4), then read the CREATE TABLE / seed rows for the pattern you need:

| Want the shape of… | Look in DB state | Tables |
|---|---|---|
| Person + status/type lookup + RBAC | v1–v4 (base) | `employee`, `user`, `role`, `privilege`, `operation`, `module`, and the `*status`/`*type` lookups |
| Master data with hierarchy | v5 | `brand`, `category`, `subcategory`, `item`, `unittype` |
| Supplier | v5 | `supplier`, `supplierstatus`, `suppliertype`, `supply` |
| Header + line-item transaction | v6 | `puorder`, `puoitem`, `puostatus` |

---

## H. Do-NOT-reuse / traps

- **College modules** (`attendance`, `batchregistration`, `bookdistribution`, `class`, `payment`, `student`) — empty placeholders; nothing to lift.
- **POS client entities** (`customer.ts`, `invoice*.ts` in `C/entity/`) — client-only, **no server side**; don't wire them expecting an API.
- **`base` for reference reading** — prefer **V1** (identical features, cleaner naming). Use `base` only as the thing you *fork* to start your project.
- **Hardcoded secrets / disabled auth** — see §B warning.
- **Filename typos are real** (`CountByDesignaitonDao`, `suplier`, `puoderservice.ts`, `authoritysevice.ts`) — match them exactly when pulling, or your import breaks.

---

## How to ask me to use this

Just name the row. Examples:
- *"Pull the JWT security package (index §B) and rename it for NCRPTS."* → I fetch only those files from V4.
- *"I'm building the estimate module — show me the header+line-item pattern (§A / §F)."* → I open Puorder + Puoitem only.
- *"Give me the Item module trio to base my Package module on."* → V2 ItemController/Dao/Entity only.

No need to paste code or point me at whole folders — this index is the pointer.
