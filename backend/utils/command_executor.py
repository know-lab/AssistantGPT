import os
import subprocess


class CommandExecutor:
    def __init__(self, workdir_override=None):
        self.workdir_override = workdir_override

    def execute(self, command):
        try:
            result = subprocess.run(
                command,
                shell=True,
                cwd=self.workdir_override,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                check=True,
            )
            return result.returncode, result.stdout, result.stderr
        except subprocess.CalledProcessError as e:
            return 1, None, str(e)

    def execute_chain(self, commands):
        for command in commands:
            returncode, stdout, stderr = self.execute(command)
            if returncode != 0:
                return returncode, stdout, stderr
        return 0, None, None

    def execute_with_timeout(self, command, timeout):
        try:
            result = subprocess.run(
                command,
                shell=True,
                cwd=self.workdir_override,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=timeout,
                check=True,
            )
            return result.returncode, result.stdout, result.stderr
        except subprocess.TimeoutExpired as e:
            return 1, None, str(e)
        except subprocess.CalledProcessError as e:
            return 1, None, str(e)

    def set_environment_variable(self, key, value):
        if self.workdir_override is not None:
            os.chdir(self.workdir_override)
        os.environ[key] = value

    def unset_environment_variable(self, key):
        if self.workdir_override is not None:
            os.chdir(self.workdir_override)
        del os.environ[key]

    def set_workdir_override(self, workdir_override):
        self.workdir_override = workdir_override

    def get_workdir_override(self):
        return self.workdir_override
