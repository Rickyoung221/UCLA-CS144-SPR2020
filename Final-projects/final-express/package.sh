#!/usr/bin/env bash
PROJ_NAME=final-express
TMP_DIR=/tmp/${PROJ_NAME}
ZIP_FILE=${PROJ_NAME}.zip
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#error function
function error_exit()
{
   echo -e "ERROR: $1" 1>&2
   rm -rf ${TMP_DIR}
   exit 1
}

# make sure running in container
if [ `whoami` != "cs144" ]; then
    error_exit "You need to run this script within the container"
fi

# clean any existing files
rm -rf ${TMP_DIR}
mkdir ${TMP_DIR}

# change to dir contains this script
cd $DIR

# check file existence
if [ -f ${ZIP_FILE} ]; then
    rm -f  ${ZIP_FILE}
fi
if [ ! -f "load.sh" ]; then
    error_exit "Missing $DIR/load.sh"
fi
if [ ! -f "package.json" ]; then
    error_exit "Missing $DIR/package.json"
fi

zip -rq ${ZIP_FILE} . -x 'node_modules/*' '.git/*'
if [ $? -ne 0 ]; then
    error_exit "Create ${ZIP_FILE} failed, check for error messages in console."
fi

# remove temp files
cd $DIR
rm -rf $TMP_DIR

echo "Created '${DIR}/${ZIP_FILE}', please submit it to CCLE."

exit 0
