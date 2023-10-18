import subprocess
import os

class CommandExecutor:
    def __init__(self, workdir_override=None):
        self.workdir_override = None

    def execute(self, command):
        try:
            result = subprocess.run(command, shell=True, cwd=self.workdir_override, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            return result.returncode, result.stdout, result.stderr
        except Exception as e:
            return 1, None, str(e)

    def execute_chain(self, commands):
        for command in commands:
            returncode, stdout, stderr = self.execute(command)
            if returncode != 0:
                return returncode, stdout, stderr
        return 0, None, None
    
    def execute_with_timeout(self, command, timeout):
        try:
            result = subprocess.run(command, shell=True, cwd=self.workdir_override, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=timeout)
            return result.returncode, result.stdout, result.stderr
        except subprocess.TimeoutExpired as e:
            return 1, None, str(e)
        except Exception as e:
            return 1, None, str(e)
        
    def set_environment_variable(self, key, value):
        try:
            if self.workdir_override is not None:
                os.chdir(self.workdir_override)
            os.environ[key] = value
            return 0, None
        except Exception as e:
            return 1, str(e)
        
    def unset_environment_variable(self, key):
        try:
            if self.workdir_override is not None:
                os.chdir(self.workdir_override)
            del os.environ[key]
            return 0, None
        except Exception as e:
            return 1, str(e)
        
    def set_workdir_override(self, workdir_override):
        self.workdir_override = workdir_override

    def get_workdir_override(self):
        return self.workdir_override
    
