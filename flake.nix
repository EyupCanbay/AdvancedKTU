{
  description = "AdvancedKTU - Waste Management System Development Environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            bun
            nodejs_22
            go_1_24
            git
            curl
            openssl
            pkg-config
          ];

          shellHook = ''
            echo "AdvancedKTU Development Environment"
            echo "Node version: $(node --version)"
            echo "Go version: $(go version)"
            echo "bun version: $(bun --version)"
          '';
        };
      }
    );
}
