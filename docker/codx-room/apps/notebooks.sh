codx python
pip install jupyter
python3 -m notebook --generate-config
sed -i "s/# c.NotebookApp.token.*/c.NotebookApp.token \= ''/" $HOME/.jupyter/jupyter_notebook_config.py
python3 -m notebook