"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
app_1.client.on('message', function (msg) {
    var _a;
    var splitted = msg.content.split(' ');
    if (msg.author.bot || msg.channel.type != 'dm' && splitted[0].replace(/[\\<>@#&!]/g, '') != ((_a = app_1.client.user) === null || _a === void 0 ? void 0 : _a.id))
        return;
    if (!app_1.settings.owners.includes(msg.author.id))
        msg.reply('Sorry, you\'re not allowed to use this bot. If you believe this is an error, please contect the bot owner.');
    var command;
    var args = __spreadArray([], splitted, true);
    command = args.shift() || '';
    if (msg.channel.type != 'dm')
        command = args.shift() || '';
    command = command.toLowerCase();
    var available = getCommands();
    if (!Object.keys(app_1.settings.commands).includes(command))
        return msg.reply("Unknown command. The available commands are: `".concat(available.join(' '), "`"));
    if (!available.includes(command))
        return msg.reply("This command has been disabled in the settings. The available commands are: `".concat(available.join(' '), "`"));
    switch (command) {
        case 'on':
            if (app_1.on)
                return msg.channel.send('The bot is already `on`.');
            (0, app_1.startMonitoring)();
            (0, app_1.setStatus)(true);
            msg.channel.send('The bot has been set to `on`.');
            break;
        case 'off':
            if (!app_1.on)
                return msg.channel.send('The bot is already `off`.');
            (0, app_1.stopMonitoring)();
            (0, app_1.setStatus)(false);
            msg.channel.send('The bot has been set to `off`.');
            break;
        case 'list':
            (function () {
                if (!app_1.list.length)
                    return msg.channel.send('There are no currently tracked targets.');
                var str = 'These are the currently tracked targets:';
                for (var _i = 0, list_1 = app_1.list; _i < list_1.length; _i++) {
                    var target = list_1[_i];
                    str += "\n- ".concat(target.longName() || "`".concat(target.name, " (").concat(target.id, ")`"));
                }
                msg.channel.send(str);
            })();
            break;
        case 'help':
            msg.channel.send('These are the currently available commands:' +
                (app_1.settings.commands.on ? '\n- `on` -> Sets the bot in online mode.' : '') +
                (app_1.settings.commands.off ? '\n- `off` -> Sets the bot in offline mode.' : '') +
                (app_1.settings.commands.list ? '\n- `list` -> Shows you the currently tracked targets.' : '') +
                (app_1.settings.commands.help ? '\n- `help` -> Shows you this message.' : ''));
            break;
        default:
            break;
    }
});
/**
 * Returns an array with the available commands.
 */
function getCommands() {
    var result = [];
    for (var command in app_1.settings.commands) {
        // @ts-ignore
        if (app_1.settings.commands[command])
            result.push(command);
    }
    return result;
}
