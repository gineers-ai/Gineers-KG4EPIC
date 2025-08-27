# EPIC-TIDE Sample Use Cases

## 🎮 Use Case 1: Flappy Bird Game

### PATH Definition
```yaml
PATH_Flappy_Bird:
  WHAT: "Simple Flappy Bird game creation"
  HOW:
    - WORK_Setup_Game_Environment
    - WORK_Initialize_Game_Objects
    - WORK_Define_Game_Variables
    - WORK_Game_Loop
    - parallel:
        - WORK_Game_Over_State
        - WORK_Restart_Logic
  METRIC:
    [ ] Game window opens correctly
    [ ] Bird responds to gravity and jump
    [ ] Pipes spawn and move continuously
    [ ] Collision triggers game over
    [ ] Score increments when passing pipes
    [ ] Restart resets state cleanly
```

### Sample WORKs

```yaml
WORK_Setup_Game_Environment:
  WHAT: "Initialize display for gameplay"
  HOW:
    - "Create a game window (400x600)"
    - "Set background image or color"
    - "Initialize pygame or chosen framework"
  METRIC:
    [ ] Window opens at correct size
    [ ] Background displays consistently
    [ ] Framework initialized without errors

WORK_Initialize_Game_Objects:
  WHAT: "Create core objects (bird, pipes)"
  HOW:
    - "Place bird at screen center"
    - "Assign gravity & jump properties to bird"
    - "Create pipe pairs with random gaps"
    - "Spawn pipes at right edge of screen"
  METRIC:
    [ ] Bird visible & affected by gravity
    [ ] Pipes scroll smoothly left
    [ ] Gap size is consistent

WORK_Game_Loop:
  WHAT: "Main game execution loop"
  HOW:
    - "Handle input events (spacebar/tap)"
    - "Update bird position (gravity + jump)"
    - "Move pipes leftward"
    - "Check collisions"
    - "Update score on pipe pass"
    - "Render all objects"
  METRIC:
    [ ] Game runs at 60 FPS
    [ ] Input responsive within 1 frame
    [ ] No visual glitches
```

### Sample TIDE Execution

```yaml
TIDE_1_PATH_Flappy_Bird:
  WHAT: "First attempt at Flappy Bird game"
  HOW:
    WORK_Setup_Game_Environment:
      status: ✅
      evidence: "Window opened 400x600, pygame initialized"
    WORK_Initialize_Game_Objects:
      status: ❌
      evidence: "Bird falls through floor - no collision boundary"
    WORK_Define_Game_Variables:
      status: ✅
      evidence: "All variables initialized"
    WORK_Game_Loop:
      status: ⏸️
      reason: "Blocked by bird collision issue"
  METRIC:
    [✅] Game window opens correctly
    [❌] Bird responds to gravity and jump (falls through floor)
    [ ] Pipes spawn and move continuously
    [ ] Collision triggers game over
    [ ] Score increments when passing pipes
    [ ] Restart resets state cleanly
  outcome: "partial - need floor collision"
  learnings: "Always define world boundaries before physics"
```

---

## 📝 Use Case 2: RESTful Memo Server

### PATH Definition
```yaml
PATH_Memo_Server:
  WHAT: "Simple RESTful Memo Server (API only)"
  HOW:
    - WORK_Project_Setup
    - WORK_Database_Design
    - WORK_API_Design
    - parallel:
        - WORK_CRUD_Implementation
        - WORK_Error_Handling
    - WORK_Testing
  METRIC:
    [ ] Server starts with configuration
    [ ] Database schema created successfully
    [ ] CRUD APIs respond with correct status codes
    [ ] Errors handled gracefully
    [ ] All tests pass with >90% coverage
```

### Sample WORKs

```yaml
WORK_Project_Setup:
  WHAT: "Initialize project structure and environment"
  HOW:
    - "Select framework (Express/FastAPI)"
    - "Create folder layout: src/, tests/, config/"
    - "Setup package.json or requirements.txt"
    - "Add config for DB connection, port"
  METRIC:
    [ ] "Hello World" endpoint runs
    [ ] Config loads without hardcoding
    [ ] Dependencies installed successfully

WORK_Database_Design:
  WHAT: "Define memo data model and DB connection"
  HOW:
    - "Design table 'memos': id, title, content, created_at, updated_at"
    - "Setup DB client/driver (postgres/mysql)"
    - "Create migration scripts"
    - "Test connection pooling"
  METRIC:
    [ ] Schema applied to database
    [ ] Insert/select test query works
    [ ] Connection pool handles concurrent requests

WORK_CRUD_Implementation:
  WHAT: "Implement Create, Read, Update, Delete operations"
  HOW:
    - "POST /api/memos - Create memo"
    - "GET /api/memos - List all memos"
    - "GET /api/memos/:id - Get specific memo"
    - "PUT /api/memos/:id - Update memo"
    - "DELETE /api/memos/:id - Delete memo"
  METRIC:
    [ ] All endpoints return correct status codes
    [ ] Data persistence verified
    [ ] Response format consistent (JSON)
```

### Sample TIDE with Issues and Recovery

```yaml
TIDE_1_PATH_Memo_Server:
  WHAT: "First attempt at Memo Server"
  HOW:
    WORK_Project_Setup:
      status: ✅
      evidence: "Express server running on port 3000"
    WORK_Database_Design:
      status: ✅
      evidence: "PostgreSQL schema applied"
    WORK_API_Design:
      status: ✅
      evidence: "OpenAPI spec defined"
    WORK_CRUD_Implementation:
      status: ❌
      evidence: "POST works, PUT fails with 'id' undefined"
      error: "Route parameter not parsed correctly"
    WORK_Error_Handling:
      status: ✅
      evidence: "Global error handler catches all"
  outcome: "partial - PUT endpoint broken"
  learnings: "Express needs :id not {id} for route params"

TIDE_2_PATH_Memo_Server:
  WHAT: "Fixed route parameter issue"
  HOW:
    WORK_Project_Setup:
      status: ✅
      reused_from: "TIDE_1"
    WORK_Database_Design:
      status: ✅
      reused_from: "TIDE_1"
    WORK_CRUD_Implementation:
      status: ✅
      evidence: "All CRUD operations working"
      fix_applied: "Changed route from '/api/memos/{id}' to '/api/memos/:id'"
    WORK_Testing:
      status: ✅
      evidence: "15/15 tests passing, 95% coverage"
  METRIC:
    [✅] Server starts with configuration
    [✅] Database schema created successfully
    [✅] CRUD APIs respond with correct status codes
    [✅] Errors handled gracefully
    [✅] All tests pass with >90% coverage
  outcome: "success - PATH proven"
```

---

## 🏢 Use Case 3: E-Commerce Platform (Complex with Nested PATHs)

### Main PATH with Nested Sub-PATHs
```yaml
PATH_E_Commerce_Platform:
  WHAT: "Full e-commerce platform with user accounts, products, and orders"
  HOW:
    - WORK_Infrastructure_Setup
    - PATH_Authentication_System:  # Nested PATH
        WHAT: "Complete auth with JWT"
        HOW:
          - WORK_User_Database_Schema
          - WORK_JWT_Implementation
          - WORK_Login_Endpoints
          - WORK_Password_Recovery
        METRIC:
          [ ] Users can register
          [ ] Users can login
          [ ] Tokens expire correctly
    - PATH_Product_Catalog:        # Nested PATH
        WHAT: "Product management system"
        HOW:
          - WORK_Product_Database
          - WORK_Search_Implementation
          - parallel:
              - WORK_Category_System
              - WORK_Image_Upload
        METRIC:
          [ ] Products CRUD working
          [ ] Search returns relevant results
          [ ] Images upload and display
    - PATH_Shopping_Cart:          # Nested PATH
        WHAT: "Cart and checkout flow"
        HOW:
          - WORK_Cart_Session_Management
          - WORK_Cart_Operations
          - WORK_Checkout_Process
          - WORK_Payment_Integration
        METRIC:
          [ ] Items persist in cart
          [ ] Checkout calculates correctly
          [ ] Payment processes successfully
    - WORK_Integration_Testing
  METRIC:
    [ ] Complete user journey works
    [ ] All subsystems integrated
    [ ] Performance meets requirements
    [ ] Security scan passes
```

### Execution with Multiple TIDEs

```yaml
TIDE_1_PATH_E_Commerce_Platform:
  WHAT: "Initial attempt at e-commerce platform"
  HOW:
    WORK_Infrastructure_Setup: ✅
    PATH_Authentication_System:
      status: "partial"
      completed: 3/4 WORKs
      issue: "Password recovery email fails"
    PATH_Product_Catalog:
      status: "not started"
      reason: "Focusing on auth first"
  outcome: "partial - auth system 75% complete"
  
TIDE_2_PATH_E_Commerce_Platform:
  WHAT: "Fixed email service, continue with products"
  HOW:
    PATH_Authentication_System:
      status: ✅
      evidence: "All auth features working"
    PATH_Product_Catalog:
      status: "partial"
      completed: 3/4 WORKs
      issue: "Image upload size limit hit"
  outcome: "partial - auth done, products 75%"

TIDE_3_PATH_E_Commerce_Platform:
  WHAT: "Complete platform with all features"
  HOW:
    PATH_Authentication_System: ✅ (reused)
    PATH_Product_Catalog: ✅ (fixed image limits)
    PATH_Shopping_Cart: ✅
    WORK_Integration_Testing: ✅
  METRIC:
    [✅] Complete user journey works
    [✅] All subsystems integrated
    [✅] Performance meets requirements
    [✅] Security scan passes
  outcome: "success - platform fully operational"
```

---

## 🔄 Use Case 4: Microservice Migration (Showing Parallel Execution)

### PATH with Heavy Parallelization
```yaml
PATH_Monolith_to_Microservices:
  WHAT: "Break monolith into 5 microservices"
  HOW:
    - WORK_Analyze_Dependencies
    - WORK_Design_Service_Boundaries
    - parallel:  # All services developed in parallel
        - PATH_User_Service:
            - WORK_Extract_User_Logic
            - WORK_Create_User_API
            - WORK_User_Service_Tests
        - PATH_Product_Service:
            - WORK_Extract_Product_Logic
            - WORK_Create_Product_API
            - WORK_Product_Service_Tests
        - PATH_Order_Service:
            - WORK_Extract_Order_Logic
            - WORK_Create_Order_API
            - WORK_Order_Service_Tests
    - WORK_Service_Discovery_Setup
    - WORK_API_Gateway_Configuration
    - WORK_End_to_End_Testing
  METRIC:
    [ ] All services running independently
    [ ] Inter-service communication working
    [ ] No functionality lost from monolith
    [ ] Performance improved or maintained
```

---

## 📊 Knowledge Evolution Example

### From Multiple Projects to Reusable Patterns

```yaml
# After 3 similar game projects:
DISTILLED_WORK_Game_Setup:
  WHAT: "Standard game initialization"
  HOW:
    - "Create window with configurable size"
    - "Initialize game framework"
    - "Setup frame rate controller"
    - "Load base assets"
  METRIC:
    [ ] Window responsive
    [ ] Target FPS achieved
    [ ] Assets loaded

# After 3 similar API projects:
DISTILLED_PATH_REST_API:
  WHAT: "Standard REST API structure"
  HOW:
    - WORK_Project_Scaffolding
    - WORK_Database_Setup
    - WORK_Model_Definition
    - WORK_CRUD_Endpoints
    - WORK_Authentication_Middleware
    - WORK_Error_Handling
    - WORK_API_Documentation
    - WORK_Testing_Suite
  METRIC:
    [ ] All endpoints documented
    [ ] Authentication working
    [ ] Tests passing
    [ ] Deployable artifact created

# WHISTLE combining patterns:
WHISTLE_CREATE_GAME_API:
  WHAT: "Create game with backend API"
  includes:
    - DISTILLED_PATH_REST_API
    - DISTILLED_WORK_Game_Setup
    - DISTILLED_WORK_Websocket_Integration
  usage: "whistle CREATE_GAME_API --game-type multiplayer"
```

---

## Key Takeaways from Use Cases

1. **Simple Projects** (Flappy Bird): Single PATH, few WORKs, 1-2 TIDEs typical
2. **Standard Projects** (Memo Server): Single PATH, moderate WORKs, 2-3 TIDEs for perfection
3. **Complex Projects** (E-Commerce): Nested PATHs, many WORKs, 3+ TIDEs expected
4. **Parallel Projects** (Microservices): Heavy use of parallel execution
5. **Knowledge Evolution**: Patterns emerge after 3+ similar implementations

Each use case demonstrates:
- PATH orchestrates WORKs
- WORKs remain pure and reusable
- TIDEs show real execution with learning
- WHAT/HOW/METRIC structure scales from simple to complex

---

*These use cases show EPIC-TIDE handling everything from games to enterprise systems*