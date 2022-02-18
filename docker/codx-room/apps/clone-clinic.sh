echo "entrypoint $GIT_REPO_PROJECT"
set -x
if [ ! -z "$GIT_REPO_PROJECT" ]; then
  cd /home/coder
  if [ -z "$GIT_REPO_FOLDER" ]; then
    git clone --depth 1 --branch ${GIT_REPO_BRANCH:-main} $GIT_REPO_PROJECT
  else 
    FOLDER=${GIT_REPO_FOLDER}
    DIR=$(echo $GIT_REPO_PROJECT | grep -o '[^/]*$')
    mkdir $DIR
    cd $DIR
    git init
    git sparse-checkout init
    git sparse-checkout set $FOLDER
    git remote add remote ${GIT_REPO_PROJECT}.git
    git pull --depth 1 remote ${GIT_REPO_BRANCH:-main}
  fi
fi