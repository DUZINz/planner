using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Planner.Web.Models;
using Planner.Web.Services;

namespace Planner.Tests
{
    [TestClass]
    public class SchedulerServiceTests
    {
        private Mock<IEventService> _eventServiceMock;

        [TestInitialize]
        public void Setup()
        {
            _eventServiceMock = new Mock<IEventService>();
        }

        [TestMethod]
        public void GetAllEvents_ShouldReturnAllEvents()
        {
            // Arrange
            var events = new List<Event>
            {
                new Event { Id = 1, Title = "Event 1", Description = "Description 1", StartTime = DateTime.Now, EndTime = DateTime.Now.AddHours(1), IsAllDay = false },
                new Event { Id = 2, Title = "Event 2", Description = "Description 2", StartTime = DateTime.Now.AddDays(1), EndTime = DateTime.Now.AddDays(1).AddHours(2), IsAllDay = false }
            };
            _eventServiceMock.Setup(es => es.GetAllEvents()).Returns(events);

            // Act
            var result = _eventServiceMock.Object.GetAllEvents();

            // Assert
            Assert.AreEqual(2, result.Count());
        }

        [TestMethod]
        public void GetEventById_ShouldReturnEvent_WhenEventExists()
        {
            // Arrange
            var eventId = 1;
            var eventItem = new Event { Id = eventId, Title = "Event 1", Description = "Description 1", StartTime = DateTime.Now, EndTime = DateTime.Now.AddHours(1), IsAllDay = false };
            _eventServiceMock.Setup(es => es.GetEventById(eventId)).Returns(eventItem);

            // Act
            var result = _eventServiceMock.Object.GetEventById(eventId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(eventId, result.Id);
        }

        [TestMethod]
        public void CreateEvent_ShouldAddEvent()
        {
            // Arrange
            var newEvent = new Event { Title = "New Event", Description = "New Description", StartTime = DateTime.Now, EndTime = DateTime.Now.AddHours(1), IsAllDay = false };
            _eventServiceMock.Setup(es => es.CreateEvent(newEvent)).Verifiable();

            // Act
            _eventServiceMock.Object.CreateEvent(newEvent);

            // Assert
            _eventServiceMock.Verify(es => es.CreateEvent(newEvent), Times.Once);
        }

        [TestMethod]
        public void UpdateEvent_ShouldModifyEvent_WhenEventExists()
        {
            // Arrange
            var existingEvent = new Event { Id = 1, Title = "Event 1", Description = "Description 1", StartTime = DateTime.Now, EndTime = DateTime.Now.AddHours(1), IsAllDay = false };
            _eventServiceMock.Setup(es => es.UpdateEvent(existingEvent)).Verifiable();

            // Act
            _eventServiceMock.Object.UpdateEvent(existingEvent);

            // Assert
            _eventServiceMock.Verify(es => es.UpdateEvent(existingEvent), Times.Once);
        }

        [TestMethod]
        public void DeleteEvent_ShouldRemoveEvent_WhenEventExists()
        {
            // Arrange
            var eventId = 1;
            _eventServiceMock.Setup(es => es.DeleteEvent(eventId)).Verifiable();

            // Act
            _eventServiceMock.Object.DeleteEvent(eventId);

            // Assert
            _eventServiceMock.Verify(es => es.DeleteEvent(eventId), Times.Once);
        }
    }
}