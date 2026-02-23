const { withPodfile } = require('@expo/config-plugins');

module.exports = function withFollyFix(config) {
  return withPodfile(config, (mod) => {
    const podfile = mod.modResults.contents;

    const fix = `
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++20'
    end
  end
`;

    mod.modResults.contents = podfile.replace(
      /react_native_post_install\(installer.*?\)/,
      (match) => `${match}\n${fix}`
    );

    return mod;
  });
};