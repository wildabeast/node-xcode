var fullProject = require('./fixtures/full-project')
    fullProjectStr = JSON.stringify(fullProject),
    pbx = require('../lib/pbxProject'),
    pbxFile = require('../lib/pbxFile'),
    proj = new pbx('.');

function cleanHash() {
    return JSON.parse(fullProjectStr);
}

exports.setUp = function (callback) {
    proj.hash = cleanHash();
    callback();
}

exports.addResourceFile = {
    'should return a pbxFile': function (test) {
        var newFile = proj.addResourceFile('assets.bundle');

        test.equal(newFile.constructor, pbxFile);
        test.done()
    },
    'should set a uuid on the pbxFile': function (test) {
        var newFile = proj.addResourceFile('assets.bundle');

        test.ok(newFile.uuid);
        test.done()
    },
    'should set a fileRef on the pbxFile': function (test) {
        var newFile = proj.addResourceFile('assets.bundle');

        test.ok(newFile.fileRef);
        test.done()
    },
    'should populate the PBXBuildFile section with 2 fields': function (test) {
        var newFile = proj.addResourceFile('assets.bundle'),
            buildFileSection = proj.pbxBuildFileSection(),
            bfsLength = Object.keys(buildFileSection).length;

        test.equal(60, bfsLength);
        test.ok(buildFileSection[newFile.uuid]);
        test.ok(buildFileSection[newFile.uuid + '_comment']);

        test.done();
    },
    'should add the PBXBuildFile comment correctly': function (test) {
        var newFile = proj.addResourceFile('assets.bundle'),
            commentKey = newFile.uuid + '_comment',
            buildFileSection = proj.pbxBuildFileSection();

        test.equal(buildFileSection[commentKey], 'assets.bundle in Resources');
        test.done();
    },
    'should add the PBXBuildFile object correctly': function (test) {
        var newFile = proj.addResourceFile('assets.bundle'),
            buildFileSection = proj.pbxBuildFileSection(),
            buildFileEntry = buildFileSection[newFile.uuid];

        test.equal(buildFileEntry.isa, 'PBXBuildFile');
        test.equal(buildFileEntry.fileRef, newFile.fileRef);
        test.equal(buildFileEntry.fileRef_comment, 'assets.bundle');

        test.done();
    },
    'should populate the PBXFileReference section with 2 fields': function (test) {
        var newFile = proj.addResourceFile('assets.bundle'),
            fileRefSection = proj.pbxFileReferenceSection(),
            frsLength = Object.keys(fileRefSection).length;

        test.equal(68, frsLength);
        test.ok(fileRefSection[newFile.fileRef]);
        test.ok(fileRefSection[newFile.fileRef + '_comment']);

        test.done();
    },
    'should populate the PBXFileReference comment correctly': function (test) {
        var newFile = proj.addResourceFile('assets.bundle'),
            fileRefSection = proj.pbxFileReferenceSection(),
            commentKey = newFile.fileRef + '_comment';

        test.equal(fileRefSection[commentKey], 'assets.bundle');
        test.done();
    },
    'should add the PBXFileReference object correctly': function (test) {
        var newFile = proj.addResourceFile('Plugins/assets.bundle'),
            fileRefSection = proj.pbxFileReferenceSection(),
            fileRefEntry = fileRefSection[newFile.fileRef];

        test.equal(fileRefEntry.isa, 'PBXFileReference');
        test.equal(fileRefEntry.fileEncoding, undefined);
        test.equal(fileRefEntry.lastKnownFileType, '"wrapper.plug-in"');
        test.equal(fileRefEntry.name, 'assets.bundle');
        test.equal(fileRefEntry.path, 'Plugins/assets.bundle');
        test.equal(fileRefEntry.sourceTree, '"<group>"');

        test.done();
    },
    'should add to the Plugins PBXGroup group': function (test) {
        var newFile = proj.addResourceFile('Plugins/assets.bundle'),
            plugins = proj.pbxGroupByName('Plugins');

        test.equal(plugins.children.length, 1);
        test.done();
    },
    'should have the right values for the PBXGroup entry': function (test) {
        var newFile = proj.addResourceFile('Plugins/assets.bundle'),
            plugins = proj.pbxGroupByName('Plugins'),
            pluginObj = plugins.children[0];

        test.equal(pluginObj.comment, 'assets.bundle');
        test.equal(pluginObj.value, newFile.fileRef);
        test.done();
    },
    'should add to the PBXSourcesBuildPhase': function (test) {
        var newFile = proj.addResourceFile('Plugins/assets.bundle'),
            sources = proj.pbxResourcesBuildPhaseObj();

        test.equal(sources.files.length, 13);
        test.done();
    },
    'should have the right values for the Sources entry': function (test) {
        var newFile = proj.addResourceFile('Plugins/assets.bundle'),
            sources = proj.pbxResourcesBuildPhaseObj(),
            sourceObj = sources.files[12];

        test.equal(sourceObj.comment, 'assets.bundle in Resources');
        test.equal(sourceObj.value, newFile.uuid);
        test.done();
    }
}
