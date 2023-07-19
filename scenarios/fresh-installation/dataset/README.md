# Retrieve and assign a record at a status of "Ready for Review"

This dataset contains a handful of declarations, all in "Ready for Review" status. Each declaration has 4 x 0.4 MB attachments.

The dataset has been generated using the Farajaland data-generator with the following command:

```
NUMBER_OF_ATTACHMENTS_PER_RECORD=4 REGISTER=false START_YEAR=2007 END_YEAR=2023 yarn data-generator
```

Which I stopped after it had generated the desired amount of declarations.

```
bash infrastructure/emergency-backup-metadata.sh
```

was used to create the zip. If you want to restore it locally, please run `yarn restore-scenario fresh-installation` command.
