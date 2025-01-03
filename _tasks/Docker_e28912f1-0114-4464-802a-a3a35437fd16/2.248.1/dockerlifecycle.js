"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const tl = require("azure-pipelines-task-lib/task");
const dockerCommandUtils = require("azure-pipelines-tasks-docker-common/dockercommandutils");
const utils = require("./utils");
function run(connection, outputUpdate) {
    let output = "";
    let command = tl.getInput("command", true);
    let containerName = tl.getInput("container", true);
    let commandArguments = dockerCommandUtils.getCommandArguments(tl.getInput("arguments", false));
    // Map between specified container names and their actual ID
    // Allow custom containers names through
    let container = containerName;
    let containerMap = tl.getVariable("agent.containermapping");
    if (containerMap) {
        try {
            let map = JSON.parse(containerMap);
            if (map[containerName] && map[containerName].id) {
                container = map[containerName].id;
            }
            else {
                tl.debug("Container lifecycle command used on container not registered with the agent: " + containerName);
            }
        }
        catch (ex) {
            console.error(ex);
        }
    }
    else {
        tl.debug("Missing container mapping data");
    }
    if (command == "start") {
        return dockerCommandUtils.start(connection, container, commandArguments, (data) => output += data).then(() => {
            let taskOutputPath = utils.writeTaskOutput("start", output);
            outputUpdate(taskOutputPath);
        });
    }
    else if (command == "stop") {
        return dockerCommandUtils.stop(connection, container, commandArguments, (data) => output += data).then(() => {
            let taskOutputPath = utils.writeTaskOutput("stop", output);
            outputUpdate(taskOutputPath);
        });
    }
    else {
        throw new Error(tl.loc('CommandNotRecognized', command));
    }
}
exports.run = run;
