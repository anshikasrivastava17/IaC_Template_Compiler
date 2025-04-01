const keywordMappings = {
    // Arithmetic Functions
    "ADD": "add",
    "SUBTRACT": "subtract",
    "MULTIPLY": "multiply",
    "DIVIDE": "divide",
    "MODULUS": "modulus",
    "POWER": "power",
    "SQRT": "sqrt",
    "CUBEROOT": "cubeRoot",
    "FACTORIAL": "factorial",
    "LOG": "log",
    "EXPONENT": "exponent",
    "ROUND": "round",
    "CEIL": "ceil",
    "FLOOR": "floor",
    "ABSOLUTE": "absolute",

    // Trigonometric Functions
    "SINE": "sine",
    "COSINE": "cosine",
    "TANGENT": "tangent",

    // Utility Functions
    "TORADIANS": "toRadians",
    "TODEGREES": "toDegrees",
    "RANDOMNUMBER": "randomNumber",
    "RANDOMINTEGER": "randomInteger",
    "MAX": "max",
    "MIN": "min",
    "COUNT": "count",
    "RANGE": "range",
    "UPPERCASE": "uppercase",
    "LOWERCASE": "lowercase",

    // Statistical Functions
    "MEAN": "mean",
    "MEDIAN": "median",
    "MODE": "mode",
    "VARIANCE": "variance",
    "STANDARDDEVIATION": "standardDeviation",

    // Compute Management
    "CREATEINSTANCE": "createInstance",
    "STARTINSTANCE": "startInstance",
    "STOPINSTANCE": "stopInstance",
    "TERMINATEINSTANCE": "terminateInstance",
    "RESIZEINSTANCE": "resizeInstance",
    "LISTINSTANCES": "listInstances",
    "CHECKINSTANCESTATUS": "checkInstanceStatus",

    // Storage Management
    "CREATESTORAGE": "createStorage",
    "ATTACHSTORAGE": "attachStorage",
    "DETACHSTORAGE": "detachStorage",
    "CREATEBUCKET": "createBucket",
    "DELETEBUCKET": "deleteBucket",
    "DELETESTORAGE": "deleteStorage",
    "LISTFILES": "listFiles",

    // Networking
    "CREATENETWORK": "createNetwork",
    "ASSIGNIP": "assignIp",
    "SETFIREWALLRULE": "setFirewallRule"
};


function getKeyword(token) {
    const upperToken = token.toUpperCase();
    return keywordMappings[upperToken] ? upperToken : token;
}


module.exports = { keywordMappings, getKeyword };
