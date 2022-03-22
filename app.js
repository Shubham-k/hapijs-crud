const hapi = require("@hapi/hapi");
const joi = require("joi");
const connection = require("./dbconfig/index");
const createUser = require("./models/users");
const dbConnection = connection.connect;
const passwordWork = require("./models/hashPassword");

const server = new hapi.Server({
  host: "localhost",
  port: 3000,
  router: {
    stripTrailingSlash: true, //ignore the browser slash
  },
});

// adding a route
server.route({
  method: "GET",
  path: "/",
  handler: (request, h) => {
    return { message: "request is working correctly!" };
  },
});

//post route
server.route({
  method: "POST",
  path: "/",
  handler: (request, h) => {
    const payLoad = request.payload;
    return payLoad;
  },
});

// get request for reading user
server.route({
  method: "GET",
  path: "/users",
  handler: (request, h) => {
    const obj = [
      {
        name: "Shubham",
        age: 20,
        email: "shuanj10@gmail.com",
      },
      {
        name: "Saurabh",
        age: 21,
        email: "saurabh0417.cse19@chitkara.edu.in",
      },
    ];
    return h.response(obj).code(201); //remember this line
  },
});

//to serve static file

//starting the server
const launch = async () => {
  try {
    await server.start();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
  console.log(`server is running on port :- ${server.info.uri}`);
};

launch();

const serveStaticFiles = async () => {
  try {
    await server.register(require("@hapi/inert")); //registering plugin "inert"
    server.route({
      method: "GET",
      path: "/file",
      handler: (request, h) => {
        return h.file("public/html/index.html");
      },
    });
  } catch (error) {
    throw error;
  }
};

serveStaticFiles();

const getYourLocation = async () => {
  try {
    await server.register({
      plugin: require("hapi-geo-locate"),
      options: {
        enabledByDefault: true,
      },
    });

    server.route({
      method: "GET",
      path: "/location",
      handler: (request, h) => {
        return request.location;
      },
    });
  } catch (error) {
    throw error;
  }
};

//plugin basics
getYourLocation();

const visionPlugin = async () => {
  try {
    await server.register({
      plugin: require("@hapi/vision"),
    });
  } catch (error) {
    throw error;
  }
};

visionPlugin(); //setting up the vision plugin for using templates

//setting up for using handlebars
server.views({
  engines: {
    html: require("handlebars"),
  },
  relativeTo: __dirname,
  path: "views",
});

//route for rendering home.html and via this we can also send the data
server.route({
  method: "GET",
  path: "/home",
  handler: (request, h) => {
    return h.view("home", {
      name: "Shubham Kumar",
    });
  },
});

server.route({
  method: "GET",
  path: "/about",
  handler: (request, h) => {
    return h.view("about", {
      name: "Shubham Kumar",
      age: 20,
      role: "sde intern @ Rario",
    });
  },
});

server.route({
  method: "GET",
  path: "/signup",
  handler: (request, h) => {
    return h.view("signup");
  },
});

// server.route({
//   method: "GET",
//   path: "/welcome",
//   handler: (request, h) => {
//     return h.view("welcome");
//   },
// });

server.route({
  method: "POST",
  path: "/welcome",
  handler: (request, h) => {
    if (request.payload.password === request.payload.confirmPassword) {
      const hashedPassword = passwordWork.hashPassword(
        request.payload.password
      );
      createUser(
        request.payload.firstName,
        request.payload.lastName,
        request.payload.email,
        request.payload.mobileNo,
        request.payload.age,
        hashedPassword,
        hashedPassword
      );
      return h.view("welcome");
    }
    return h.response({ error: "password did't matched!" }).code(400);
  },
});

//login page
server.route({
  method: "GET",
  path: "/login",
  handler: (request, h) => {
    return h.view("login");
  },
});

//after logged in
server.route({
  method: "POST",
  path: "/loggedIn",
  handler: async (request, h) => {
    const searchEmail = request.payload.email;
    console.log("connected!");
    const [result] = await dbConnection.query(
      `select * from users where email="${searchEmail}"`
    );
    if (result.length === 0) {
      return h.response({
        error: "An account with this username doesn't exist !",
      });
    }
    const isMatch = await passwordWork.matchPassword(
      result[0].password,
      request.payload.password
    );
    if (!isMatch) {
      return h.response({ error: "credentials didn't matched !!!" });
    }
    return h.view("welcome2", {
      firstName: result[0].firstName,
      lastName: result[0].lastName,
    });
  },
});

//updating page route
server.route({
  method: "GET",
  path: "/updateUser",
  handler: (request, h) => {
    return h.view("updateUser");
  },
});

//route where updating request will get hit
server.route({
  method: "POST",
  path: "/updated",
  handler: (request, h) => {
    // console.log(request.payload);
    const email = request.payload.email;
    const obj = request.payload;
    const keys = Object.keys(obj);
    keys.forEach(async (key, index) => {
      if (obj[key] != "" && key != "email") {
        await dbConnection.query(
          `update users set ${key}="${obj[key]}" where email="${email}"`
        );
        // console.log(`${key}:${obj[key]}`); key is the property and obj[key] is the value of that property
      }
    });
    return h.view("updated");
  },
});

//route for deleting user page
server.route({
  method: "GET",
  path: "/deleteUser",
  handler: (request, h) => {
    return h.view("delete");
  },
});

//action after deleting route
server.route({
  method: "POST",
  path: "/userDeleted",
  handler: async (request, h) => {
    const email = request.payload.email;
    await dbConnection.query(`delete from users WHERE email="${email}"`);
    return h.view("deleted");
  },
});
