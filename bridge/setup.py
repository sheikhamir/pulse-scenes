from setuptools import setup, find_packages

version = '0.10.0'
name = 'websockify'
long_description = open("README.md").read() + "\n" + \
    open("CHANGES.txt").read() + "\n"

setup(name=name,
      version=version,
      description="Websockify.",
      long_description=long_description,
      long_description_content_type="text/markdown",
      classifiers=[
          "Programming Language :: Python",
          "Programming Language :: Python :: 3",
          "Programming Language :: Python :: 3 :: Only",
          "Programming Language :: Python :: 3.4",
          "Programming Language :: Python :: 3.5",
          "Programming Language :: Python :: 3.6",
          "Programming Language :: Python :: 3.7",
          "Programming Language :: Python :: 3.8",
          "Programming Language :: Python :: 3.9",
        ],
      keywords='noVNC websockify',
      license='LGPLv3',
      url="https://github.com/novnc/websockify",
      author="Joel Martin",
      author_email="github@martintribe.org",

      packages=['websockify'],
      include_package_data=True,
      install_requires=['numpy'],
      zip_safe=False,
      entry_points={
        'console_scripts': [
            'websockify = websockify.websocketproxy:websockify_init',
        ]
      },
    )
