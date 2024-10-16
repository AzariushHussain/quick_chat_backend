const formatMessage = (template, variables) => {
    return template.replace(/{(.*?)}/g, (_, key) => variables[key.trim()] || '');
};

module.exports = formatMessage;
