import unittest

from backend import database


class DatabaseConfigTests(unittest.TestCase):
    def test_uses_mysql_when_no_database_url_is_configured(self):
        self.assertTrue(database.get_database_url().startswith("mysql"))


if __name__ == "__main__":
    unittest.main()
