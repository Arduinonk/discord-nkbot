const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
    // console.log(localCommands)
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, testServer);
        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;
            const existingCommand = await applicationCommands.cache.find((cmd) => cmd.name === name);
            if (existingCommand) {
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`🗑️ "${name}" - command has been deleted`);
                    continue;
                }
                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options
                    });
                    console.log(`🔃 "${name}" - command has been Edited!`)
                }
            } else {
                if (localCommand.deleted) {
                    console.log(`⏭️ Skipping registering command "${name}" as it is set to delete!`);
                    continue;
                }
                await applicationCommands.create({
                    name,
                    description,
                    options
                });
                console.log(`👍 "${name}" command Registered Successfully!`);
            }
        }

    } catch (error) {
        console.log(`There was an ERROR: ${error}`)
    }
};