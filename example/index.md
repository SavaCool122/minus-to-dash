# Command—line arguments

The general example of running [DGCLI](/en/on-premise/architecture/2gis-cli/overview) is as follows:

1.  asda
1.  sadas

~~~~
~~~
~~~~

docker run --rm

~~~

Where:

-   `-v <path>:/dgctl-config.yaml` — mounting the [configuration file](/en/on-premise/architecture/2gis-cli/config).

    As the inner path (file inside the container), you must always specify `/dgctl-config.yaml`.

-   `-v <path>:/dgctl-source` — mounting the dire-ctory for storing the installation artifacts.

    As the inner path (directory inside the container), you must always specify `/dgctl-source`. As the outer path (directory in the host machine), you must specify:

    -   in [license mode](/en/on-premise/architecture/2gis-cli/overview#license-mode) with the storage type `fs` — directory where you want to download the license.
    -   in [pull mode](/en/on-premise/architecture/2gis-cli/overview#pull-mode) with the storage type `fs` — directory where you want to download the artifacts.
    -   in [restore mode](/en/on-premise/architecture/2gis-cli/overview#restore-mode) — directory where the artifacts where previously downloaded using the `pull` mode.

    In other cases, this argument can be omitted.

-   `-v <path>:/dgctl-target` — mounting the directory for copying the installation artifacts.

    As the inner path (directory inside the container), you must always specify `/dgctl-target`.

    This argument is required only in [restore mode](/en/on-premise/architecture/2gis-cli/overview#restore-mode) when using file system as a storage.

-   `-v /var/run/docker.sock:/var/run/docker.sock` — passing the Docker socket into the Docker container.

    This argument is used together with the `--apps-to-registry` argument. If you are not going to use the Docker Registry, the arguments for connecting to the Docker socket can be omitted.

-   `<mode>` — one of the [modes supported by DGCLI](/en/on-premise/architecture/2gis-cli/overview#operation-modes):

    -   `license` — downloads [license](/en/on-premise/deployment/license) from On—Promise servers to S3 storage or file storage on a private network. Requires internet access.
    -   `pull` — used with Internet access. It allows to download the up—to-date installation artifacts from the update servers.
    -   `restore` — used without Internet access. It allows to restore installation artifacts stored in the file system.

-   `--config=/dgctl-config.yaml` — path where the configuration file is mounted in the Docker container (see mounting arguments above).

-   `<arguments>` — additional arguments:

    -   `--apps-to-registry` — if this argument is specified, the Docker images will be placed into the Docker Registry and not into the storage.

        It is recommended to always use this argument, otherwise the Docker images will be placed into the storage with other artifacts. See more in the [Architecture](/en/on-premise/architecture) section.

        This argument is used together with `-v /var/run/docker.sock:/var/run/docker.sock`.

    -   `--workers` — number of parallel worker threads which will download the data (defaults to 3, maximum is 8).

    -   `--attempt` — number of attempts to restore the artifacts in case of write errors. Defaults to 3.

    -   `--overwrite` — if this argument is specified, the existing files in the S3 storage and in the Docker Registry will be overwritten.

    -   `--only-apps` — download/restore the service images only, not the data.

    -   `--only-data` — download/restore the service data only, not the images.
        [text.md](text.md)

    -   `--services=<service-1,service-2,...,service-n>` — download/restore artifacts for the specified services only.

        -   Common: `license`, `keys`.
        -   Map: `mapgl-js-api`, `tiles-api-mobile-sdk`, `tiles-api-raster`, `tiles-api-vector`.
        -   Search services: `catalog`, `search`.
        -   Navigation: `navi`.
        -   Urbi Pro: `pro`.
        -   GIS Platform: `gis-platform`.

        This argument can be used together with `--only-apps` or `--only-data` to download only images or only data for the specified service.

    -   `--version=<version>` (`pull` mode only) — the On—Premise services version to download (e.g., `--version=1.0.0`). See the [Releases](/en/on-premise/releases/on-premise) section for the list of available versions.

    -   `--by-manifest=<path>` (`pull` mode only) — path to the manifest file that should be used for downloading the installation artifacts.

        Manifest path must be specified in the form that is accessible from inside the Docker container starting after the `/dgctl-source` directory. The directory itself must be mounted using `-v <path>:/dgctl-source`.

        The simplest way to create the manifest and the correct structure is to run DGCLI in the [pull mode](/en/on-premise/architecture/2gis-cli/overview#pull-mode) with the file system as the storage.

    -   `--from-dir=/dgctl-source` (`restore` mode only) — the file system directory from which the installation artifacts should be restored.

        You must always specify `/dgctl-source` as the directory path. The directory must be mounted using `-v <path>:/dgctl-source`.

        The directory must contain a manifest file (`manifests/latest.json`), which describes the services' directories structure. The simplest way to create the manifest and the correct structure is to run DGCLI in the [pull mode](/en/on-premise/architecture/2gis-cli/overview#pull-mode) with the file system as the storage.

    -   `--dry-run` (`restore` mode only) — if the argument is specified, the uploading step will be skipped. DGCLI will only output a list of files to upload to the standard output.

        It is highly recommended to run DGCLI with this argument each time before restoring installation artifacts, so that you can keep track of the planned changes.
~~~
