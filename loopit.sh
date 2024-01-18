#!/bin/bash
# This script is used in production, to restart the remote_job_service in the case of a failure (exception)
# usage: `sh loopit.sh python3 manage.py remote_job_service --priority=high`

# The variable $@ is the array of all the input parameters
COMMAND=$@
# echo "command is: '$COMMAND'"

until $COMMAND; do
    echo "Command crashed with a non-zero exit code ($?).  Respawning.." >&2
    sleep .5
done
