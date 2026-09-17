{ pkgs, lib, ... }:
let
  packageJson = builtins.fromJSON (builtins.readFile ./package.json);
  sanitize = name: builtins.replaceStrings [ ":" "/" " " ] [ "-" "-" "-" ] name;
  entries = map (name: {
    name = "wow-${sanitize name}";
    value.exec = "pnpm run ${lib.escapeShellArg name} \"$@\"";
  }) (builtins.attrNames (packageJson.scripts or { }));
  scripts = builtins.listToAttrs entries;
in
assert builtins.length entries == builtins.length (builtins.attrNames scripts);
{
  packages = [ pkgs.git pkgs.direnv ] ++ lib.optionals pkgs.stdenv.hostPlatform.isLinux [ pkgs.chromium ];
  env = lib.optionalAttrs pkgs.stdenv.hostPlatform.isLinux {
    PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = lib.getExe pkgs.chromium;
  };
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_24;
    bun.enable = true;
    pnpm.enable = true;
    pnpm.package = pkgs.pnpm_12;
  };
  languages.typescript.enable = true;
  dotenv.enable = true;
  inherit scripts;
}
